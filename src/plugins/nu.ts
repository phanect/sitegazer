"use strict";

import vnu = require("vnu");
import Plugin from "../interfaces/Plugin";
import Result from "../interfaces/Result";

interface NuResult {
  url: string,
  message: string,
  lastLine: number,
  firstColumn: number,
}

export default class NuHTMLChecker implements Plugin {
  public async analyze(url: string): Promise<Result[]> {
    const results: NuResult[] = await vnu(url);

    return results.map((result) => ({
      url: result.url,
      pluginName: "Nu HTML Checker",
      errors: [{
        message: result.message,
        line: result.lastLine,
        column: result.firstColumn,
      }],
    }));
  }
}
