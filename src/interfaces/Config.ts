"use strict";

export default interface Config {
  urls: ({
    url: string;
    config: {
      http: {
        res: {
          status: 200;
          headers: any;
          redirectTo: string;
        };
      };
    };
  } | string)[];
  sitemap: boolean;
  crawl: boolean;
  plugins: string[];
  userAgents?: object[];
  config?: any;
}
