import SiteLint from "../src/sitelint";
import Server from "./server";

const url = "http://localhost:3456";
const inexistentURL = "http://localhost:7171";

test("SiteLint crawl the URLs in the page when crawl: true is given", async () => {
  const server = new Server();
  server.start();

  const sitelint = new SiteLint({
    urls: [ url ],
    sitemap: false,
    crawl: true,
    plugins: [ "nu" ],
  });
  const results = await sitelint.run();

  expect(results).toEqual([
    {
      url: "http://localhost:3456",
      pluginName: "Nu HTML Checker",
      line: 3,
      column: 24,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
    },
    {
      url: "http://localhost:3456/link1",
      pluginName: "Nu HTML Checker",
      line: 3,
      column: 24,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
    },
    {
      url: "http://localhost:3456/link2",
      pluginName: "Nu HTML Checker",
      line: 11,
      column: 11,
      message: "End tag for  “body” seen, but there were unclosed elements.",
    },
    {
      url: "http://localhost:3456/link2",
      pluginName: "Nu HTML Checker",
      line: 10,
      column: 13,
      message: "Unclosed element “span”.",
    },
    {
      url: "http://localhost:3456/link2",
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
      column: 24,
      line: 3,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
      pluginName: "Nu HTML Checker",
      url: "http://localhost:3456/",
    },
  ]);

  server.close();
}, 30000);

test("SiteLint returns an error if specified host doesn't respond.", async () => {
  const sitelint = new SiteLint({
    urls: [
      inexistentURL,
    ],
    sitemap: false,
    crawl: true,
    plugins: [],
  });
  const results = await sitelint.run();

  expect(results).toEqual([{
    url: "http://localhost:7171",
    pluginName: null,
    message: "Error: Request failure for http://localhost:7171. Server doesn't respond.",
    line: 1,
    column: 1,
  }]);
});
