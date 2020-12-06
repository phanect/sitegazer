import { Server } from "http";
import express = require("express");

export default class {
  private server: Server;
  private port: number;

  constructor(port: number) {
    this.port = port;
  }

  async start(): Promise<void> {
    const app = express();
    const port = this.port;

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
              <p>Hello, World!</p>
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
              <p>Hello, World!</p>
            </body>
          </html>
        `);
      }
    });

    app.get("/sitemapped", (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>A page only on sitemap.xml</title>
          </head>
          <body>
            <span></span>
          </body>
        </html>
      `);
    });

    app.get("/sitemap.xml", (req, res) => {
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          <url>
            <loc>http://localhost:${port}/sitemapped</loc>
            <lastmod>2020-01-01</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.8</priority>
          </url>
          <url>
            <loc>http://localhost:${port}/</loc>
            <lastmod>2020-01-01</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.8</priority>
          </url>
        </urlset>
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
