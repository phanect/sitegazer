"use strict";

import "jest-extended";
import SiteLint from "../src/sitelint";
import Server from "./server";

const url = "http://localhost:3456/";

test("Chrome Console Plugin", async () => {
  const server = new Server();
  server.start();

  const sitelint = new SiteLint({
    urls: [ url ],
    sitemap: false,
    crawl: false,
    plugins: [ "chrome-console" ],
  });
  const results = await sitelint.run();

  expect(results).toIncludeSameMembers([
    {
      url: "http://localhost:3456/",
      pluginName: "Chrome Console",
      line: 0,
      column: 0,
      message: "Error: Error: Something is wrong.\n    at http://localhost:3456/:7:21",
    },
  ]);

  server.close();
}, 20000);
