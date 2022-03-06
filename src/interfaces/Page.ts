"use strict";

export default interface Page {
  url: string;
  files: {
    url: string;
    issues: {
      pluginName: string;
      message: string;
      line: number;
      column: number;
    }[];
  }[];
}
