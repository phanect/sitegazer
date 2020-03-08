"use strict";

import SiteGazer from "../src/sitegazer";
import Server from "./server";
import { sortObjects } from "./testutils";

const port = 1234;
const url = `http://localhost:${port}/`;

let server: Server;

beforeEach(async () => {
  server = new Server(port);
  await server.start();
});

afterEach(async () => {
  await server.close();
});

test("Chrome Console Plugin", async () => {
  const sitegazer = new SiteGazer({
    urls: [ url ],
    sitemap: false,
    plugins: [ "chrome-console" ],
  });
  const results = await sitegazer.run();

  expect(sortObjects(results)).toEqual(sortObjects([
    {
      url: `http://localhost:${port}/`,
      deviceType: "desktop",
      files: [{
        url: `http://localhost:${port}/`,
        issues: [{
          pluginName: "Chrome Console",
          line: 7,
          column: 23,
          message: "Error: Something is wrong in desktop site.",
        }],
      }],
    },
    {
      url: `http://localhost:${port}/`,
      deviceType: "mobile",
      files: [{
        url: `http://localhost:${port}/`,
        issues: [{
          pluginName: "Chrome Console",
          line: 8,
          column: 23,
          message: "Error: Something is wrong in mobile site.",
        }],
      }],
    },
  ]));
}, 20000);
