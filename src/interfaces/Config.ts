"use strict";

export default interface Config {
  urls: string|string[]|URL|URL[];
  sitemap: boolean;
  plugins: string[];
  userAgents?: Record<string, string>;
}
