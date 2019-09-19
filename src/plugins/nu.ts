"use strict";

import { vnu } from "vnu";
import Context from "../interfaces/Context";
import Plugin from "../interfaces/Plugin";
import Result from "../interfaces/Result";

/**
 * Lint with Nu HTML Checker.
 *
 * @param {Context} context - The context object passed from SiteLint.
 * @returns {Promise<Result[]>} The promise object of array of Results.
 */
export default (async (context: Context): Promise<Result[]> => {
  const results = await vnu(context.url);

  return results.map(result => ({
    url: result.url,
    pluginName: "Nu HTML Checker",
    errors: [{
      message: result.message,
      line: result.lastLine,
      column: result.firstColumn,
    }],
  }));
}) as Plugin;
