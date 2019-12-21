import EventEmitter = require("events");
import { Crawler, handlers, Url } from "supercrawler";
import Config from "./interfaces/Config";
import Plugin from "./interfaces/Plugin";
import Warning from "./interfaces/Warning";
import { deduplicate } from "./utils";

const defaultUAS = {
  desktop: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
  mobile: "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Mobile Safari/537.36",
};

class SiteGazer {
  private crawlers: Crawler[] = [];
  private warnings: Warning[] = [];
  private plugins: Plugin[];
  private config: Config;
  private proccessingURLcount = 0;
  private emitter = new EventEmitter();

  public constructor(config: Config) {
    this.config = config;

    this.plugins = this.config.plugins.map(plugin => require(`./plugins/${plugin}`).default);

    for (const [ deviceType, userAgent ] of Object.entries(this.config.userAgents || defaultUAS)) {
      this.crawlers.push(this.initCrawler({ deviceType, userAgent }));
    }
  }

  private initCrawler({ deviceType, userAgent }: { deviceType: string; userAgent: string }): Crawler {
    const crawler = new Crawler({
      interval: 2000,
      concurrentRequestsLimit: 1,
      robotsEnabled: false,
      robotsCacheTime: 3600000,
      userAgent: userAgent,
    });

    if (this.config.sitemap !== false) {
      crawler.addHandler(handlers.sitemapsParser());
    }

    crawler.addHandler("text/html", handlers.htmlLinkParser({
      hostnames: deduplicate(this.config.urls).map(url => new URL(url).hostname),
    }));

    crawler.on("crawledurl", (url: string, errorCode: string, statusCode: number) => {
      if (errorCode) {
        if (errorCode === "REQUEST_ERROR") {
          this.warnings.push({
            url,
            deviceType,
            pluginName: null,
            message: `Error: Request failure for ${url}. `
              + (statusCode ? `HTTP Status Code is ${statusCode}` : "Server doesn't respond."),
            line: 1,
            column: 1,
          });
        } else {
          this.warnings.push({
            url,
            deviceType,
            pluginName: null,
            message: `Error: Unexpected error on downloading ${url}. Error code is ${errorCode}. `
              + (statusCode ? `HTTP Status Code is ${statusCode}` : "No status code was given."),
            line: 1,
            column: 1,
          });
        }
      }

      this.processURL(url, deviceType, userAgent); // Note: this is async method
    });

    return crawler;
  }

  private async processURL(url: string, deviceType: string, userAgent: string): Promise<void> {
    console.info("Processed ", url);
    this.proccessingURLcount++;

    for (const plugin of this.plugins) {
      const warnings = await plugin({
        url: url,
        deviceType,
        userAgent,
      });

      this.warnings = this.warnings.concat(warnings);
    }

    this.proccessingURLcount--;
  }

  public async run(): Promise<Warning[]> {
    for (const crawler of this.crawlers) {
      const urlList = crawler.getUrlList();

      await Promise.all(
        this.config.urls.map(url => urlList.insertIfNotExists(new Url(url)))
      );

      this.proccessingURLcount = 0; // Ensure proccessingURLcount is 0

      crawler.start();

      await new Promise((resolve) => {
        crawler.on("urllistcomplete", () => {
          if (this.proccessingURLcount < 1) {
            crawler.stop();
            resolve();
          }
        });
      });
    }

    return this.warnings;
  }
}

export default SiteGazer;
