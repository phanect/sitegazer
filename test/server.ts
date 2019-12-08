import { Server } from "http";
import express = require("express");

export default class {
  private server: Server;

  start(): void {
    const app = express();
    const port = 3456;

    app.get("/", (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>test</title>
            <script>
              throw new Error("Something is wrong.");
            </script>
          </head>
          <body>
            <a href="/link1">link 1</a>
            <a href="/link2">link 2</a>
          </body>
        </html>
      `);
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

    this.server = app.listen(port);
  }

  close(): void {
    this.server.close();
  }
}
