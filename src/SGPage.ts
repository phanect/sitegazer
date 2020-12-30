import { Page, Response } from "playwright";
import Warning from "./interfaces/Warning";

export class SGPage implements Page {
  private warnings: Warning[] = [];

  constructor(private page: Page) {

  }

  public async goto(url: string, options? : {
    timeout?: number;
    waitUntil?: "domcontentloaded"|"load"|"networkidle";
    referer?: string;
  }): Promise<null|Response> {
    try {
      this.page.on("pageerror", (err: Error): void => {
        this.warnings.push({
          url: pageURL,
          deviceType: "desktop", // TODO
          pluginName: "Chrome Console",
          message: err.toString(),
          line: 1,
          column: 1,
        });
      }).on("console", msg => {
        const msgType = msg.type();

        if (
          msgType === "error" ||
          msgType === "warning" ||
          msgType === "assert" ||
          msgType === "trace"
        ) {
          const location = msg.location();

          this.warnings.push({
            pageURL: url,
            fileURL: location.url,
            deviceType: "desktop", // TODO
            pluginName: "Chrome Console",
            message: msg.text(),
            line: location.lineNumber,
            column: location.columnNumber,
          });
        }
      }).on("requestfailed", req => {
        this.warnings.push({
          pageURL: url,
          fileURL: req.url(),
          deviceType: "desktop", // TODO
          pluginName: "Chrome Console",
          message: req.failure().errorText,
          line: 0, // TODO
          column: 0, // TODO
        });
      }).on("requestfinished", (req) => {
        const res = req.response();

        this.warnings.push({
          pageURL: url,
          fileURL: req.url(),
          deviceType: "desktop", // TODO
          pluginName: "Chrome Console",
          message: `${res.status()} ${res.statusText()}`,
          line: 0, // TODO
          column: 0, // TODO
        });
      });

      const res = await this.page.goto(url, options);

      const pageURL = this.page.url();
      const html = await res.text();

      if (!res.ok()) {
        this.warnings.push({
          url: pageURL,
          deviceType: "desktop", // TODO
          pluginName: null,
          message: `Error: Request failure for ${url}. ${res.status()}: ${res.statusText()}`,
          line: 1,
          column: 1,
        });
      }

      return res;
    } catch (err) {
      if (err.message.startsWith("net::ERR_CONNECTION_REFUSED")) {
        this.warnings.push({
          url: url,
          deviceType: "desktop", // TODO,
          pluginName: null,
          message: `Error: Connection refused to ${new URL(url).host}. (ERR_CONNECTION_REFUSED)`,
          line: 1,
          column: 1,
        });
      } else if (err.message.startsWith("net::ERR_SSL_PROTOCOL_ERROR")) {
        this.warnings.push({
          url: url,
          deviceType: "desktop", // TODO,
          pluginName: null,
          message: "Error: SSL error. (ERR_SSL_PROTOCOL_ERROR)",
          line: 1,
          column: 1,
        });
      } else {
        this.warnings.push({
          url: url,
          deviceType: "desktop", // TODO,
          pluginName: null,
          message: `Error: Unexpected error on browser access: ${err.toString()}`,
          line: 1,
          column: 1,
        });
      }
    }
  }
}
