import { Crawler, handlers, Url } from "supercrawler";
import Config from "./interfaces/Config";
import Plugin from "./interfaces/Plugin";
import Result from "./interfaces/Result";

class SiteLint {
  private crawler: Crawler;
  private results: Result[];
  private plugins: Plugin[];

  public get Results(): Result[] {
    return this.results;
  }

  public constructor(private url: string, config: Config) {
    const self = this;

    self.plugins = config.plugins.map(plugin => {
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
      hostnames: [ new URL(url).hostname ],
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

    await self.crawler
      .getUrlList()
      .insertIfNotExists(new Url(self.url));
    self.crawler.start();

    return new Promise((resolve) => {
      self.crawler.on("urllistcomplete", () => {
        resolve();
      });
    });
  }
}

export default SiteLint;
