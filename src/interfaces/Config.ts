"use strict";

export default interface Config {
  urls: string[];
  sitemap: boolean;
  crawl: boolean;
  plugins: string[];
  userAgents?: Record<string, string>;
  config?: any;
}
