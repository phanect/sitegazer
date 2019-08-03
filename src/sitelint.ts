import { Crawler, handlers, Url } from "supercrawler";
import Config from "./interfaces/Config";
import Plugin from "./interfaces/Plugin";
import Result from "./interfaces/Result";
import { deduplicate } from "./utils";

class SiteLint {
  private crawler: Crawler;
  private results: Result[];
  private plugins: Plugin[];
  private config: Config;

  public get Results(): Result[] {
    return this.results;
  }

  public constructor(config: Config) {
    const self = this;
    self.config = config;

    self.plugins = self.config.plugins.map(plugin => {
      const APlugin = require(`./plugins/${plugin}`);
      return new APlugin();
    });

    self.crawler = new Crawler({
      interval: 2000,
      concurrentRequestsLimit: 1,
      // Time (ms) to cache the results of robots.txt queries.
      robotsCacheTime: 3600000,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
    });

    self.crawler.addHandler(handlers.robotsParser());
    self.crawler.addHandler(handlers.sitemapsParser());
    self.crawler.addHandler("text/html", handlers.htmlLinkParser({
      hostnames: deduplicate(self.config.urls.map(url => {
        if (typeof url === "string") {
          return new URL(url).hostname;
        } else if (typeof url === "object") {
          return new URL(url.url).hostname;
        } else {
          throw new Error("Invalid configuration: malformed URL in urls.");
        }
      })),
    }));

    self.crawler.addHandler("text/html", async (context) => {
      console.info("Processed ", context.url);

      if (!Array.isArray(self.results)) {
        self.results = [];
      }

      for (const plugin of self.plugins) {
        const results = await plugin.analyze(context.url);
        self.results = self.results.concat(results);
      }
    });
  }

  public async start(): Promise<{}> {
    const self = this;
    const urlList = self.crawler.getUrlList();

    await Promise.all(self.config.urls.map(url => {
      if (typeof url === "string") {
        return urlList.insertIfNotExists(new Url(url));
      } else if (typeof url === "object") {
        return urlList.insertIfNotExists(new Url(url.url));
      } else {
        throw new Error("Invalid configuration: malformed URL in urls.");
      }
    }));

    self.crawler.start();

    return new Promise((resolve) => {
      self.crawler.on("urllistcomplete", () => {
        resolve();
      });
    });
  }
}

export default SiteLint;
