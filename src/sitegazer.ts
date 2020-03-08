import * as puppeteer from "puppeteer";
import Sitemapper from "sitemapper";

import Config from "./interfaces/Config";
import Page from "./interfaces/Page";
import Plugin from "./interfaces/Plugin";
import Results from "./Results";
import { deduplicate, isURL, sleep } from "./utils";

const interval = 2000;

class SiteGazer {
  private results = new Results();
  private plugins: Plugin[];
  private config: Config;

  private urls: string[] = [];

  private userAgents: Record<string, string> = {
    desktop: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
    mobile: "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Mobile Safari/537.36",
  };

  public constructor(config: Config) {
    this.config = config;

    if (
      !this.config.urls ||
      (Array.isArray(this.config.urls) && this.config.urls.length < 1)
    ) {
      throw new Error("No URL is given");
    }

    this.plugins = this.config.plugins.map(plugin => require(`./plugins/${plugin}`).default);

    this.addURLs(config.urls);
  }

  private addURLs(urls: string|URL|string[]|URL[]): void {
    let _urls: (string|URL)[];

    if (Array.isArray(urls)) {
      _urls = urls;
    } else {
      _urls = [ urls ];
    }

    const urlStrings: string[] = _urls
      .map((url: string|URL) => {
        if (url instanceof URL) {
          return url.href;
        } else if (typeof url === "string" && isURL(url)) {
          return new URL(url).href;
        } else {
          this.results.add({
            pageURL: url,
            fileURL: url,
            deviceType: null,
            pluginName: null,
            message: `${url} is not a URL string`,
            line: 1,
            column: 1,
          });
          return undefined;
        }
      }).filter((urlString: string) => urlString && !this.urls.includes(urlString));

    this.urls = this.urls.concat(urlStrings);
  }

  private async loadPage(url: string, deviceType: string, userAgent: string): Promise<void> {
    const issues: Issue[] = [];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.setUserAgent(userAgent);

    page.on("console", msg => {
      const msgType = msg.type();

      if (
        msgType === "error" ||
        msgType === "warning" ||
        msgType === "assert" ||
        msgType === "trace"
      ) {
        const location = msg.location();

        return issues.push({
          pageURL: url,
          fileURL: location.url,
          deviceType,
          pluginName: "Chrome Console",
          message: msg.text(),
          line: location.lineNumber,
          column: location.columnNumber,
        });
      }
    }).on("error", err => {
      this.results.add({
        pageURL: url,
        fileURL: url,
        deviceType,
        pluginName: null,
        message: err.message,
        line: 0,
        column: 0,
      });
    }).on("pageerror", err => {
      // msg: e.g. " Error: Something is wrong in desktop site."
      // stacktrace: e.g. "        at http://localhost:3456/:7:23"
      const [ msg, stacktrace ] = err.message.split("\n");

      const destructuredStacktrace = stacktrace
        .trim() // "        at http://localhost:3456/:7:23" -> "at http://localhost:3456/:7:23"
        .replace("at ", "") // "at http://localhost:3456/:7:23" -> "http://localhost:3456/:7:23"
        .split(":"); // "http://localhost:3456/:7:23" -> [ "http", "//localhost", "3456/" "7", "23" ]
      const column = parseInt(destructuredStacktrace.pop());
      const line = parseInt(destructuredStacktrace.pop());
      const fileURL = destructuredStacktrace.join(":");

      issues.push({
        pageURL: url,
        fileURL,
        deviceType,
        pluginName: "Chrome Console",
        message: msg.trim(),
        line,
        column,
      });
    }).on("requestfailed", req => {
      issues.push({
        pageURL: url,
        fileURL: req.url(),
        deviceType,
        pluginName: "Chrome Console",
        message: req.failure().errorText,
        line: 0, // TODO
        column: 0, // TODO
      });
    }).on("requestfinished", (req) => {
      const res = req.response();

      issues.push({
        pageURL: url,
        fileURL: req.url(),
        deviceType,
        pluginName: "Chrome Console",
        message: `${res.status()} ${res.statusText()}`,
        line: 0, // TODO
        column: 0, // TODO
      });
    });

    try {
      const res = await page.goto(url);
      const pageURL = page.url();
      const html = await res.text();

      if (!res.ok()) {
        this.results.add({
          pageURL,
          fileURL: pageURL,
          deviceType,
          pluginName: null,
          message: `Error: Request failure for ${url}. ${res.status()}: ${res.statusText()}`,
          line: 1,
          column: 1,
        });
      }

      await browser.close();

      return this.processURL(pageURL, html, deviceType, userAgent, issues);
    } catch (err) {
      if (err.message.startsWith("net::ERR_CONNECTION_REFUSED")) {
        this.results.add({
          pageURL: url,
          fileURL: url,
          deviceType,
          pluginName: null,
          message: `Error: Connection refused to ${new URL(url).host}. (ERR_CONNECTION_REFUSED)`,
          line: 1,
          column: 1,
        });
      } else if (err.message.startsWith("net::ERR_SSL_PROTOCOL_ERROR")) {
        this.results.add({
          pageURL: url,
          fileURL: url,
          deviceType,
          pluginName: null,
          message: "Error: SSL error. (ERR_SSL_PROTOCOL_ERROR)",
          line: 1,
          column: 1,
        });
      } else {
        this.results.add({
          pageURL: url,
          fileURL: url,
          deviceType,
          pluginName: null,
          message: `Error: Unexpected error on browser access: ${err.toString()}`,
          line: 1,
          column: 1,
        });
      }
    }
  }

  private async processURL(url: string, html: string, deviceType: string, userAgent: string, issues: Issue[]): Promise<void> {
    console.info(`Processed ${url} (${deviceType})`);

    for (const plugin of this.plugins) {
      this.results.add(await plugin({
        url: url,
        html,
        deviceType,
        userAgent,
        issues,
      }));
    }
  }

  private async parseSiteMap(): Promise<void> {
    const targetHosts = deduplicate(this.urls.map(url => new URL(url).host));
    let pages: string[] = [];

    for (const host of targetHosts) {
      const sitemapper = new Sitemapper({
        url: `http://${host}/sitemap.xml`,
        timeout: 30000,
      });
      const sitemap = await sitemapper.fetch();
      pages = pages.concat(sitemap.sites);
    }

    this.addURLs(pages);
  }

  public async run(): Promise<Page[]> {
    if (this.config.sitemap === true) {
      await this.parseSiteMap();
    }

    for (const url of this.urls) {
      for (const [ deviceType, userAgent ] of Object.entries(this.userAgents)) {
        await this.loadPage(url, deviceType, userAgent);
        await sleep(interval);
      }
    }

    return this.results.toJSON();
  }
}

export default SiteGazer;
