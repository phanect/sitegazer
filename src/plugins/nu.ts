"use strict";

import { vnu } from "vnu";
import Context from "../interfaces/Context";
import Plugin from "../interfaces/Plugin";
import Warning from "../interfaces/Warning";

/**
 * Lint with Nu HTML Checker.
 *
 * @param {Context} context - The context object passed from SiteGazer.
 * @returns {Promise<Warning[]>} The promise object of array of Warning.
 */
export default (async (context: Context): Promise<Warning[]> => {
  const warnings = await vnu(context.url);

  return warnings.map(warning => ({
    url: warning.url,
    pluginName: "Nu HTML Checker",
    message: warning.message,
    line: warning.lastLine,
    column: warning.firstColumn,
  }));
}) as Plugin;
