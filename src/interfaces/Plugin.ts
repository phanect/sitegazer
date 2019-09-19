"use strict";

import Context from "./Context";
import Warning from "./Warning";

export default interface Plugin {
  (context: Context): Promise<Warning[]>;
}
