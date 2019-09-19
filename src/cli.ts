import commander = require("commander");
import { join } from "path";
import SiteLint from "./sitelint";

commander
  .version("0.1.0")
  .arguments("<url>")
  .option("-c, --config <config>", "Path to configuration file")
  .action((url, opts) => {
    (async () => {
      const config = require(opts.config ?
        opts.config :
        join(process.cwd(), ".sitelintrc.js")
      );

      config.urls.push(url);

      const sitelint = new SiteLint(config);
      const warnings = await sitelint.run();

      for (const warning of warnings) {
        console.info(warning.url);
        console.info(warning.pluginName);
        console.info(warning.message);
        console.info(warning.line);
        console.info(warning.column);
      }
    })();
  }).parse(process.argv);
