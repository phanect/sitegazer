"use strict";

import { Analyzer } from "hint";
import Context from "../interfaces/Context";
import Plugin from "../interfaces/Plugin";
import Warning from "../interfaces/Warning";

/**
 * Lint with webhint.
 *
 * @param {Context} context - The context object passed from SiteGazer.
 * @returns {Promise<Warning[]>} The promise object of array of Warning.
 */
export default (async (context: Context): Promise<Warning[]> => {
  const webhint: Analyzer = Analyzer.create({
    extends: [ "web-recommended" ],
    // connector: {
    //   name: "jsdom",
    // },
    // hints: {
    //   "html-checker": [ "error", {
    //     details: true,
    //   }],
    // },
    formatters: [],
  });
  const results = await webhint.analyze(context.url);
  const warnings: Warning[] = [];

  for (const result of results) {
    for (const problem of result.problems) {
      warnings.push({
        url: result.url,
        deviceType: context.deviceType,
        pluginName: "WebHint",
        message: problem.message,
        line: 0,
        column: 0,
      });
    }
  }

  return warnings;
}) as Plugin;
