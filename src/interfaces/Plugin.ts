"use strict";

import Context from "./Context";
import Result from "./Result";

export default interface Plugin {
  (context: Context): Promise<Result[]>;
}
