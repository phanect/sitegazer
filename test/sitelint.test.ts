import SiteLint from "../src/sitelint";

const url = "https://localhost:3456";

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
