"use strict";

import SiteLint from "../src/sitelint";
import Server from "./server";

const url = "http://localhost:3456";

test("Nu HTML Checker Plugin", async () => {
  const server = new Server();
  server.start();

  const sitelint = new SiteLint({
    urls: [ url ],
    sitemap: false,
    crawl: false,
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
  ]);

  server.close();
}, 10000);
