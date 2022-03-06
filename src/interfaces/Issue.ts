"use strict";

export default interface Issue {
  pageURL: string;
  fileURL: string;
  pluginName: string;
  message: string;
  line: number;
  column: number;
}
