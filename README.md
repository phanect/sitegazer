# SiteLint

## .sitelintrc.js example

```js
"use strict";

module.exports = {
  urls: [
    "https://phanective.org",
    "https://phanective.org/cv/",
    "https://google.com",
  ],
  sitemap: false,
  crawl: false,
  plugins: [ "webhint", "nu", "http" ],
  userAgents: {
    desktop: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
    mobile: "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Mobile Safari/537.36"
  },
  config: {
    webhint: {
      extends: [ "web-recommended" ],
    },
    http: {
      res: {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
        }
      }
    }
  },
};
```

&copy; 2019 Jumpei Ogawa
