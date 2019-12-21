import commander = require("commander");
import { join } from "path";
import SiteLint from "./sitelint";

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

  const sitelint = new SiteLint(config);
  const warnings = await sitelint.run();

  for (const warning of warnings) {
    console.info(warning.url);
    console.info(`${warning.line}:${warning.column} error (${warning.pluginName}) ${warning.message}`);
  }
})();
