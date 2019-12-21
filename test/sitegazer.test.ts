import SiteGazer from "../src/sitegazer";
import Server from "./server";
import { sortObjects } from "./testutils";

const url = "http://localhost:3456";
const inexistentURL = "http://localhost:7171";

let server: Server;

beforeEach(() => {
  server = new Server();
  server.start();
});

afterEach(() => {
  server.close();
});

test("SiteGazer crawl the URLs in the page when crawl: true is given", async () => {
  const sitegazer = new SiteGazer({
    urls: [ url ],
    sitemap: false,
    crawl: true,
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
      url: "http://localhost:3456/link1",
      deviceType: "desktop",
      pluginName: "Nu HTML Checker",
      line: 3,
      column: 24,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
    },
    {
      url: "http://localhost:3456/link2",
      deviceType: "desktop",
      pluginName: "Nu HTML Checker",
      line: 11,
      column: 11,
      message: "End tag for  “body” seen, but there were unclosed elements.",
    },
    {
      url: "http://localhost:3456/link2",
      deviceType: "desktop",
      pluginName: "Nu HTML Checker",
      line: 10,
      column: 13,
      message: "Unclosed element “span”.",
    },
    {
      url: "http://localhost:3456/link2",
      deviceType: "desktop",
      pluginName: "Nu HTML Checker",
      line: 3,
      column: 24,
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
    {
      url: "http://localhost:3456",
      deviceType: "mobile",
      pluginName: "Nu HTML Checker",
      line: 6,
      column: 15,
      message: "Consider avoiding viewport values that prevent users from resizing documents.",
    },
    {
      url: "http://localhost:3456/link1",
      deviceType: "mobile",
      pluginName: "Nu HTML Checker",
      line: 3,
      column: 24,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
    },
    {
      url: "http://localhost:3456/link2",
      deviceType: "mobile",
      pluginName: "Nu HTML Checker",
      line: 11,
      column: 11,
      message: "End tag for  “body” seen, but there were unclosed elements.",
    },
    {
      url: "http://localhost:3456/link2",
      deviceType: "mobile",
      pluginName: "Nu HTML Checker",
      line: 10,
      column: 13,
      message: "Unclosed element “span”.",
    },
    {
      url: "http://localhost:3456/link2",
      deviceType: "mobile",
      pluginName: "Nu HTML Checker",
      line: 3,
      column: 24,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
    },
    // TODO Follwing warning should be removed in the future:
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

test("SiteGazer returns an error if specified host doesn't respond.", async () => {
  const sitegazer = new SiteGazer({
    urls: [
      inexistentURL,
    ],
    sitemap: false,
    crawl: true,
    plugins: [],
  });
  const results = await sitegazer.run();

  expect(results).toEqual(sortObjects([
    {
      url: "http://localhost:7171",
      deviceType: "desktop",
      pluginName: null,
      message: "Error: Request failure for http://localhost:7171. Server doesn't respond.",
      line: 1,
      column: 1,
    },
    {
      url: "http://localhost:7171",
      deviceType: "mobile",
      pluginName: null,
      message: "Error: Request failure for http://localhost:7171. Server doesn't respond.",
      line: 1,
      column: 1,
    },
  ]));
});
