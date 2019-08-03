import express = require("express");

const app = express();
const port: number = 3456;

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title></title>
      </head>
      <body>
        <a href="/link1.html">link 1</a>
        <a href="/link2.html">link 2</a>
      </body>
    </html>
  `);
});

app.get("/link1", (req, res) => {
  res.send(`
    <html>
      <head>
        <title></title>
      </head>
      <body>
        <a href="/">top</a>
        <a href="/link2.html">link 2</a>
      </body>
    </html>
  `);
});

app.get("/link2", (req, res) => {
  res.send(`
    <html>
      <head>
        <title></title>
      </head>
      <body>
        <a href="/link1.html">link 1</a>
        <a href="/">top</a>
        <span> <!-- Error: unmatched HTML tag -->
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
