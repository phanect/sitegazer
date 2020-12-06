# SiteGazer

![GitHub Actions Status](https://github.com/phanect/sitegazer/workflows/GitHub%20Actions/badge.svg)

SiteGazer crawls all of your pages and find errors from the crawled pages.

## Requirement

- Node.js 10.x, 12.x, 14.x, or 15.x
- Java 8+ (if you want to run `nu` plugin)
- [puppeteer dependencies](https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix) if you want to install SiteGazer on Linux (SiteGazer depends on puppeteer)

Note: SiteGazer does not work on Windows Subsystems for Linux due to puppeteer limitation. See also [this issue](https://github.com/puppeteer/puppeteer/issues/1837).

## Install

```shell
$ yarn global add sitegazer
```

```shell
$ npm install -g sitegazer
```

If you want to install with `sudo` on Linux systems, yarn is recommended way to install.
Unfortunately, `sudo npm install -g sitegazer` may fail to install due to permission issue.

## Usage

1. Create sitegazer.config.js

Here's example of sitegazer.config.js. For full reference, see [sitegazer.config.js reference](#sitegazerconfigjs-reference) section

```js
"use strict";

module.exports = {
  urls: [
    "https://phanective.org",
    "https://google.com",
  ],
  sitemap: true,
  crawl: true,
  plugins: [ "nu", "chrome-console" ],
};
```

2. Start SiteGazer

```shell
$ cd /path/to/directory # Move to the directory which sitegazer.config.js exists
$ sitegazer
```

## sitegazer.config.js reference

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
  plugins: [ "nu", "chrome-console" ],
  userAgents: {
    desktop: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
    mobile: "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Mobile Safari/537.36"
  },
};
```

### `urls`

Type: `string[]`
Default: `[]`

URLs to lint.
If `crawl: false` and `sitemap: false`, SiteGazer only lint the pages listed in `urls`.

### `sitemap`

Type: `boolean`
Default: `true`

If true, SiteGazer lint the URLs listed in sitemap.xml, in addition to URLs listed in `urls`.

### `crawl`

Type: `boolean`
Default: `true`

If true, SiteGazer detect `<a>` tags from the linted pages, and lint the detected URLs in addition to URLs listed in `urls`.

### `plugins`

Type: `string[]`
Default: `[]`

Linter plugins.
Currently SiteGazer Supports following plugins:

- `nu` ([Nu HTML Checker](https://validator.github.io/validator/))
- `chrome-console` (List errors detected on Console of Chrome Developer Tools)

### userAgents

Type: `object`
Default:
```js
{
  desktop: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
  mobile: "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Mobile Safari/537.36",
}
```

Object of user agent strings.
If two or more user agent strings are given, SiteGazer lint with each user agent strings.

## License

Apache 2.0

&copy; 2019 Jumpei Ogawa
