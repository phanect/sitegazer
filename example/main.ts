"use strict";

import { chromium } from "playwright";
import { initErrorDetector } from "../src/error-detector";

(async () => {
  const browser = await chromium.launch({
    // headless: false,
    // devtools: true,
  });
  const { context, errorDetector } = initErrorDetector(await browser.newContext());
  // const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://bell-face.com/");
  //await page.click(".bf");
  await page.goto("https://bell-face.com/function/");

  console.log(JSON.stringify(errorDetector.toJSON(), null, 2));

  // await browser.close();
})();
