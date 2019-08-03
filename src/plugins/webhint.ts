"use strict";

import { Analyzer } from "hint";
import Plugin from "../interfaces/Plugin";
import Result from "../interfaces/Result";


export default class WebHint implements Plugin {
  private webhint: Analyzer;

  public constructor() {
    this.webhint = Analyzer.create({
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
  }

  public async analyze(url: string): Promise<Result[]> {
    const results = await this.webhint.analyze(url);

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
  }
}
