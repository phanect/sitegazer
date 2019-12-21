"use strict";

import "jest-extended";
import SiteGazer from "../src/sitegazer";
import Server from "./server";

const url = "http://localhost:3456/";

let server: Server;

beforeEach(() => {
  server = new Server();
  server.start();
});

afterEach(() => {
  server.close();
});

test("Chrome Console Plugin", async () => {
  const sitegazer = new SiteGazer({
    urls: [ url ],
    sitemap: false,
    crawl: false,
    plugins: [ "chrome-console" ],
  });
  const results = await sitegazer.run();

  expect(results).toIncludeSameMembers([
    {
      url: "http://localhost:3456/",
      pluginName: "Chrome Console",
      line: 0,
      column: 0,
      message: "Error: Error: Something is wrong.\n    at http://localhost:3456/:7:21",
    },
  ]);
}, 20000);
