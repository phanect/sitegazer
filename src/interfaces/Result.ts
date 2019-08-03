"use strict";

export default interface Result {
  url: string;
  pluginName: string;
  errors: {
    message: string;
    line: number;
    column: number;
  }[];
}
