"use strict";

import Context from "../interfaces/Context";
import Plugin from "../interfaces/Plugin";
import Warning from "../interfaces/Warning";

/**
 * Find browser errors.
 *
 * @param {Context} context - The context object passed from SiteGazer.
 * @returns {Promise<Warning[]>} The promise object of array of Warning.
 */
export default (async (context: Context): Promise<Warning[]> => context.browserErrors.map(error => ({
  url: context.url,
  deviceType: context.deviceType,
  pluginName: "Chrome Console",
  message: error.toString(),
  line: 0,
  column: 0,
}))) as Plugin;
