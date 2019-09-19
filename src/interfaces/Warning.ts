"use strict";

export default interface Result {
  url: string;
  pluginName: string;
  message: string;
  line: number;
  column: number;
}
