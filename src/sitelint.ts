import { Crawler, handlers, Url } from "supercrawler";
import Config from "./interfaces/Config";
import Plugin from "./interfaces/Plugin";
import Result from "./interfaces/Result";
import { deduplicate } from "./utils";

const defaultUAS = {
  desktop: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
  mobile: "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Mobile Safari/537.36",
};

class SiteLint {
  private crawler: Crawler;
  private results: Result[] = [];
  private plugins: Plugin[];
  private config: Config;

  public constructor(config: Config) {
    this.config = config;

    this.plugins = this.config.plugins.map(plugin => require(`./plugins/${plugin}`).default);

    this.crawler = new Crawler({
      interval: 2000,
      concurrentRequestsLimit: 1,
      robotsEnabled: false,
      robotsCacheTime: 3600000,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
    });

    if (this.config.sitemap !== false) {
      this.crawler.addHandler(handlers.sitemapsParser());
    }

    this.crawler.addHandler("text/html", handlers.htmlLinkParser({
      hostnames: deduplicate(this.config.urls).map(url => new URL(url).hostname),
    }));

    this.crawler.on("crawledurl", async (url: string, errorCode: string, statusCode: number) => {
      console.info("Processed ", url);

      if (errorCode) {
        if (errorCode === "REQUEST_ERROR") {
          this.results.push({
            url,
            pluginName: null,
            message: `Error: Request failure for ${url}. `
              + (statusCode ? `HTTP Status Code is ${statusCode}` : "Server doesn't respond."),
            line: 1,
            column: 1,
          });
        } else {
          this.results.push({
            url,
            pluginName: null,
            message: `Error: Unexpected error on downloading ${url}. Error code is ${errorCode}. `
              + (statusCode ? `HTTP Status Code is ${statusCode}` : "No status code was given."),
            line: 1,
            column: 1,
          });
        }
      }


      for (const plugin of this.plugins) {
        const results = await plugin({
          url: url,
          userAgents: this.config.userAgents || [ defaultUAS ],
        });
        this.results = this.results.concat(results);
      }
    });
  }

  public async run(): Promise<Result[]> {
    const urlList = this.crawler.getUrlList();

    await Promise.all(
      this.config.urls.map(url => urlList.insertIfNotExists(new Url(url)))
    );

    this.crawler.start();

    return new Promise((resolve) => {
      this.crawler.on("urllistcomplete", () => {
        resolve(this.results);
      });
    });
  }
}

export default SiteLint;
