"use strict";

export default interface Config {
  urls: string|string[]|URL|URL[];
  sitemap: boolean;
  crawl: boolean;
  plugins: string[];
  userAgents?: Record<string, string>;
}
