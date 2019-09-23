# SiteLint

SiteLint crawls all of your pages and find errors from the crawled pages.

## Requirement

Node.js 10+

## Install

```shell
$ npm install -g @phanect/sitelint
```

## Usage

1. Create .sitelintrc.js

Here's example of .sitelintrc.js. For full reference, see [.sitelintrc.js reference](sitelintrcjs-reference) section

```js
"use strict";

module.exports = {
  urls: [
    "https://phanective.org",
    "https://google.com",
  ],
  sitemap: true,
  crawl: true,
  plugins: [ "nu" ],
};
```

## .sitelintrc.js reference

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
  plugins: [ "webhint", "nu" ],
  userAgents: {
    desktop: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
    mobile: "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Mobile Safari/537.36"
  },
  config: {
    webhint: {
      extends: [ "web-recommended" ],
    },
  },
};
```

### `urls`

Type: `string[]`
Default: `[]`

URLs to lint.
If `crawl: false` and `sitemap: false`, SiteLint only lint the pages listed in `urls`.

### `sitemap`

Type: `boolean`
Default: `true`

If true, SiteLint lint the URLs listed in sitemap.xml, in addition to URLs listed in `urls`.

### `crawl`

Type: `boolean`
Default: `true`

If true, SiteLint detect `<a>` tags from the linted pages, and lint the detected URLs in addition to URLs listed in `urls`.

### `plugins`

Type: `string[]`
Default: `[]`

Linter plugins.
Currently SiteLint Supports following plugins:

- `nu` ([Nu HTML Checker](https://validator.github.io/validator/))
- `webhint` ([WebHint](https://webhint.io/))

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
If two or more user agent strings are given, SiteLint lint with each user agent strings.

### `config`

Type: `object`
Default: `{}`

Config for each plugins.

### `config.webhint`

Type: `object`
Default: `{}`

Config for WebHint.
It is the same as .hintrc.
See [WebHint document](https://webhint.io/docs/user-guide/) to learn more.

Example:

```js
{
  extends: [ "web-recommended" ],
}
```

## License

Apache 2.0

&copy; 2019 Jumpei Ogawa
