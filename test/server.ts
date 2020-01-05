import { Server } from "http";
import express = require("express");

export default class {
  private server: Server;

  async start(): Promise<void> {
    const app = express();
    const port = 3456;

    app.get("/", (req, res) => {
      // if mobile user agent is sent
      if (req.get("User-Agent").match(/(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot) .+? mobile|palm|windows\s+ce|opera\ mini|avantgo|mobilesafari|docomo)/i)) {
        res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>test</title>
              <meta name="viewport" content="width=device-width, target-densityDpi=device-dpi, user-scalable=no">
              <script>
                throw new Error("Something is wrong in mobile site.");
              </script>
            </head>
            <body>
              <a href="/link1">link 1</a>
              <a href="/link2">link 2</a>
            </body>
          </html>
        `);
      } else { // if desktop user agent is sent
        res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>test</title>
              <script>
                throw new Error("Something is wrong in desktop site.");
              </script>
            </head>
            <body>
              <a href="/link1">link 1</a>
              <a href="/link2">link 2</a>
            </body>
          </html>
        `);
      }
    });

    app.get("/link1", (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>test</title>
          </head>
          <body>
            <a href="/">top</a>
            <a href="/link2">link 2</a>
          </body>
        </html>
      `);
    });

    app.get("/link2", (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>test</title>
          </head>
          <body>
            <a href="/link1">link 1</a>
            <a href="/">top</a>
            <span> <!-- Error: unmatched HTML tag -->
          </body>
        </html>
      `);
    });

    const self = this;

    return new Promise(resolve => {
      self.server = app.listen({ port }, () => resolve());
    });
  }

  async close(): Promise<void> {
    const self = this;

    return new Promise(resolve => {
      self.server.close(() => resolve());
    });
  }
}
