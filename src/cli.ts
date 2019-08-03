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
      const results = await sitelint.run();

      for (const result of results) {
        console.info(result.url);
        console.info(result.pluginName);

        for (const error of result.errors) {
          console.info(error.message);
          console.info(error.line);
          console.info(error.column);
        }
      }
    })();
  }).parse(process.argv);
