import chalk from "chalk-cjs";

import { getOptions } from "../common";

function error(...args: any[]) {
  const { logLevel } = getOptions();
  if (["error", "warn", "info"].indexOf(logLevel) > -1) {
    console.log(chalk.redBright(...args));
  }
}

function warn(...args: any[]) {
  const { logLevel } = getOptions();
  if (["warn", "info"].indexOf(logLevel) > -1) {
    console.log(chalk.yellowBright(...args));
  }
}

function info(...args: any[]) {
  const { logLevel } = getOptions();
  if (["info"].indexOf(logLevel) > -1) {
    console.log(chalk.blueBright(...args));
  }
}

function success(...args: any[]) {
  const { logLevel } = getOptions();
  if (["info"].indexOf(logLevel) > -1) {
    console.log(chalk.greenBright(...args));
  }
}

function log(...args: any[]) {
  const { logLevel } = getOptions();
  if (["info"].indexOf(logLevel) > -1) {
    console.log(...args);
  }
}

function path(...args: any[]) {
  const { logLevel } = getOptions();
  if (["info"].indexOf(logLevel) > -1) {
    console.log(chalk.gray(...args));
  }
}

export default {
  error,
  warn,
  info,
  success,
  log,
  path,
};
