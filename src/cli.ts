import commander = require("commander");
import { join } from "path";
import SiteGazer from "./sitegazer";

commander
  .version("0.1.0")
  .arguments("<url>")
  .option("-c, --config <config>", "Path to configuration file");

commander.parse(process.argv);

(async () => {
  const config = require(commander.config ?
    commander.config :
    join(process.cwd(), "sitegazer.config.js")
  );

  if (commander.url) {
    config.urls.push(commander.url);
  }

  const sitegazer = new SiteGazer(config);
  const issues = await sitegazer.run();

  for (const issue of issues) {
    console.info(`${issue.url} (${issue.deviceType})`);
    console.info(`${issue.line}:${issue.column} error (${issue.pluginName}) ${issue.message}` + "\n");
  }
})();
