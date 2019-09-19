import SiteLint from "../src/sitelint";

const url = "https://localhost:3456";
const inexistentURL = "http://localhost:7171";

test("SiteLint crawls the URLs in the pages", async () => {
  const sitelint = new SiteLint({
    urls: [
      url,
    ],
    sitemap: false,
    crawl: true,
    plugins: [],
  });
  const results = await sitelint.run();

  const resultURLs: string[] = results.map(result => result.url).sort();

  expect(resultURLs).toBe([
    `${url}/`,
    `${url}/link1.html`,
    `${url}/link2.html`,
  ]);
});

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
    errors: [{
      message: "Error: Request failure for http://localhost:7171. Server doesn't respond.",
      line: 1,
      column: 1,
    }],
  }]);
});
