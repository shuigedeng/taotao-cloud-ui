import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { program } from "commander";

import main from "./index";
import { Options } from "./typings";
import logger from "./utils/logger";

const pkgPath = resolve(__dirname, "..", "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
program.name(pkg.name).version(pkg.version).description(pkg.description);

program
  .option("-e, --entry <name>", "entry path")
  .option("-o, --output <name>", "output file")
  .option("-r, --resolvers <value>", "library name")
  .option("-i, --ignore-path <name>", "entry ignore files config")
  .option("-l, --log-level <value>", "log level")
  .option("-c, --check", "check output file")
  .parse(process.argv);

const options = program.opts<Options>();

const checkIndex = process.argv.findIndex(
  (arg) => ["-c", "--check"].indexOf(arg) > -1
);
options.check = checkIndex === -1 || process.argv[checkIndex + 1] !== "false";

main(options)
  .catch((err: Error) => {
    logger.error(err.stack ?? err);
  })
  .finally(() => {
    process.exit(0);
  });
