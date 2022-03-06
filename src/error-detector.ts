import { BrowserContext, Page } from "playwright";
import Results from "./Results";

function extractInfoFromError(err: Error): { fileURL: string, line: number, column: number } {
  // msg: e.g. " Error: Something is wrong in desktop site."
  // stacktrace: e.g. "        at http://localhost:3456/:7:23"
  const stacktrace = err.stack.split("\n");
  stacktrace.shift(); // Remove error message in the first line

  for (const trace of stacktrace) {
    const destructuredStacktrace = trace
      .trim() // "        at http://localhost:3456/:7:23" -> "at http://localhost:3456/:7:23"
      .replace("at ", "") // "at http://localhost:3456/:7:23" -> "http://localhost:3456/:7:23"
      .split(":"); // "http://localhost:3456/:7:23" -> [ "http", "//localhost", "3456/" "7", "23" ]
    const column = parseInt(destructuredStacktrace.pop());
    const line = parseInt(destructuredStacktrace.pop());
    const fileURL = destructuredStacktrace.join(":");

    if (fileURL === "<anonymous>") {
      continue;
    }

    return { fileURL, line, column };
  }
}

function _initErrorCollector(page: Page, results = new Results()): Page {
  page.on("console", (msg) => {
    const msgType = msg.type();

    if (
      msgType === "error" ||
      msgType === "warning" ||
      msgType === "assert" ||
      msgType === "trace"
    ) {
      const location = msg.location();

      return results.add({
        pageURL: page.url(),
        fileURL: location.url,
        pluginName: "Chrome Console",
        message: msg.text(),
        line: location.lineNumber,
        column: location.columnNumber,
      });
    }
  }).on("pageerror", (err) => {
    const { fileURL, line, column } = extractInfoFromError(err);

    results.add({
      pageURL: page.url(),
      fileURL,
      pluginName: "Chrome Console",
      message: err.message,
      line,
      column,
    });
  }).on("requestfailed", (req) => {
    results.add({
      pageURL: page.url(),
      fileURL: req.url(),
      pluginName: "Chrome Console",
      message: req.failure().errorText,
      line: 0, // TODO
      column: 0, // TODO
    });
  }).on("requestfinished", (req) => {
    (async () => {
      const res = await req.response();

      const status = res?.status();
      if (400 <= status || typeof status === "undefined") {
        results.add({
          pageURL: page.url(),
          fileURL: req.url(),
          pluginName: "Chrome Console",
          message: status ? `${status} ${res.statusText()}` : "Unexpected failure on request",
          line: 0, // TODO
          column: 0, // TODO
        });
      }
    })();
  });

  return page;
}

export function initErrorCollector(target: BrowserContext|Page): ({ context?: BrowserContext, page?: Page, collector: Results }) {
  const results = new Results();

  if ("newPage" in target) { // if target is BrowserContext
    target.on("page", (page) => {
      _initErrorCollector(page, results);
    });
    return { context: target, collector: results };
  } else { // if target is Page
    const page = _initErrorCollector(target, results);
    return { page, collector: results };
  }
}
