"use strict";

export default interface Warning {
  url: string;
  pluginName: string;
  message: string;
  line: number;
  column: number;
}
