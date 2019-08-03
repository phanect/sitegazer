"use strict";

import Result from "./Result";

export default interface Plugin {
  analyze(url: string): Promise<Result[]>;
}
