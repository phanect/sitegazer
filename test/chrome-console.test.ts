"use strict";

import SiteGazer from "../src/sitegazer";
import Server from "./server";
import { sortObjects } from "./testutils";

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

  expect(sortObjects(results)).toEqual(sortObjects([
    {
      url: "http://localhost:3456/",
      deviceType: "desktop",
      pluginName: "Chrome Console",
      line: 0,
      column: 0,
      message: "Error: Error: Something is wrong in desktop site.\n    at http://localhost:3456/:7:23",
    },
    {
      url: "http://localhost:3456/",
      deviceType: "mobile",
      pluginName: "Chrome Console",
      line: 0,
      column: 0,
      message: "Error: Error: Something is wrong in mobile site.\n    at http://localhost:3456/:8:23",
    },
  ]));
}, 20000);
