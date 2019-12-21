"use strict";

import * as puppeteer from "puppeteer";

import Context from "../interfaces/Context";
import Plugin from "../interfaces/Plugin";
import Warning from "../interfaces/Warning";

/**
 * Find browser errors.
 *
 * @param {Context} context - The context object passed from SiteGazer.
 * @returns {Promise<Warning[]>} The promise object of array of Warning.
 */
export default (async (context: Context): Promise<Warning[]> => {
  const errors: Error[] = [];
  const onError = (err: Error): void => {
    errors.push(err);
  };

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.setUserAgent(context.userAgent);
  page.on("pageerror", onError);
  page.on("error", onError);

  await page.goto(context.url);

  const pageURL = page.url();

  await browser.close();

  return errors.map(error => ({
    url: pageURL,
    deviceType: context.deviceType,
    pluginName: "Chrome Console",
    message: error.toString(),
    line: 0,
    column: 0,
  }));
}) as Plugin;
