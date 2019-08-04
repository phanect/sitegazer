"use strict";

import { Analyzer } from "hint";
import Context from "../interfaces/Context";
import Plugin from "../interfaces/Plugin";
import Result from "../interfaces/Result";

/**
 * Lint with webhint.
 *
 * @param {Context} context - The context object passed from SiteLint.
 * @returns {Promise<Result[]>} The promise object of array of Results.
 */
export default (async (context: Context): Promise<Result[]> => {
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

  for (const result of results) {
    console.log(`Result for: ${result.url}`);

    for (const problem of result.problems) {
      console.log(`${problem.hintId} - ${problem.resource} - ${problem.message}`);
    }
  }

  return results.map((result) => ({
    url: result.url,
    pluginName: "WebHint",
    errors: result.problems.map((problem) => ({
      message: problem.message,
      line: 0,
      column: 0,
    })),
  }));
}) as Plugin;
