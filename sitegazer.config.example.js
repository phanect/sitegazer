"use strict";

module.exports = {
  urls: [
    "https://phanective.org/",
  ],
  sitemap: false,
  crawl: false,
  plugins: [ "nu", "chrome-console" ],
  userAgents: {
    desktop: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
    mobile: "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Mobile Safari/537.36"
  },
};
