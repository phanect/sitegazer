"use strict";

import SiteGazer from "../src/sitegazer";
import Server from "./server";
import { sortObjects } from "./testutils";

const url = "http://localhost:3456";

let server: Server;

beforeEach(() => {
  server = new Server();
  server.start();
});

afterEach(() => {
  server.close();
});

test("Nu HTML Checker Plugin", async () => {
  const sitegazer = new SiteGazer({
    urls: [ url ],
    sitemap: false,
    crawl: false,
    plugins: [ "nu" ],
  });
  const results = await sitegazer.run();

  expect(sortObjects(results)).toEqual(sortObjects([
    {
      url: "http://localhost:3456",
      deviceType: "desktop",
      pluginName: "Nu HTML Checker",
      line: 3,
      column: 26,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
    },
    {
      url: "http://localhost:3456",
      deviceType: "mobile",
      pluginName: "Nu HTML Checker",
      line: 3,
      column: 26,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
    },
    // This error message ensures that mobile user agent is properly working
    {
      url: "http://localhost:3456",
      deviceType: "mobile",
      pluginName: "Nu HTML Checker",
      line: 6,
      column: 15,
      message: "Consider avoiding viewport values that prevent users from resizing documents.",
    },
    // TODO following warnings should not occur when crawl: false.
    // However, since crawl: false is not working for now, SiteGazer crawls and analyze
    // linked pages and warns the error in those pages.
    // ▼▼
    {
      column: 24,
      line: 3,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
      deviceType: "desktop",
      pluginName: "Nu HTML Checker",
      url: "http://localhost:3456/link1",
    },
    {
      column: 11,
      line: 11,
      message: "End tag for  “body” seen, but there were unclosed elements.",
      deviceType: "desktop",
      pluginName: "Nu HTML Checker",
      url: "http://localhost:3456/link2",
    },
    {
      column: 13,
      line: 10,
      message: "Unclosed element “span”.",
      deviceType: "desktop",
      pluginName: "Nu HTML Checker",
      url: "http://localhost:3456/link2",
    },
    {
      column: 24,
      line: 3,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
      deviceType: "desktop",
      pluginName: "Nu HTML Checker",
      url: "http://localhost:3456/link2",
    },
    {
      column: 24,
      line: 3,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
      deviceType: "mobile",
      pluginName: "Nu HTML Checker",
      url: "http://localhost:3456/link1",
    },
    {
      column: 11,
      line: 11,
      message: "End tag for  “body” seen, but there were unclosed elements.",
      deviceType: "mobile",
      pluginName: "Nu HTML Checker",
      url: "http://localhost:3456/link2",
    },
    {
      column: 13,
      line: 10,
      message: "Unclosed element “span”.",
      deviceType: "mobile",
      pluginName: "Nu HTML Checker",
      url: "http://localhost:3456/link2",
    },
    {
      column: 24,
      line: 3,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
      deviceType: "mobile",
      pluginName: "Nu HTML Checker",
      url: "http://localhost:3456/link2",
    },
    // ▲▲ Above warnings should not occur when crawl: false.

    // TODO Follwing warnings should be removed in the future:
    // http://localhost:3456 and http://localhost:3456/ are both analyzed
    // although they are the same page.
    // @see https://github.com/brendonboshell/supercrawler/pull/37
    {
      column: 26,
      line: 3,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
      deviceType: "desktop",
      pluginName: "Nu HTML Checker",
      url: "http://localhost:3456/",
    },
    {
      column: 26,
      line: 3,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
      deviceType: "mobile",
      pluginName: "Nu HTML Checker",
      url: "http://localhost:3456/",
    },
    {
      url: "http://localhost:3456/",
      deviceType: "mobile",
      pluginName: "Nu HTML Checker",
      line: 6,
      column: 15,
      message: "Consider avoiding viewport values that prevent users from resizing documents.",
    },
  ]));
}, 30000);
