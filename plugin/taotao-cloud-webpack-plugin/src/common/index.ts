import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import ignore from "ignore";

import { Options } from "../typings";

/** 项目根路径 */
export const projectPath = process.cwd();

/** 忽略文件 */
export const ignoreFile = ignore().add("node_modules");

export const optionsDefault: Required<Options> = {
  entry: "/",
  output: "auto-import.js",
  resolvers: "element-ui",
  ignorePath: ".generatorignore",
  logLevel: "info",
  check: true,
};

let options = optionsDefault;

/** 设置配置选项 */
export const setOptions = async (params?: Options) => {
  options = Object.assign({}, options, params);

  const projectIgnorePath = resolve(projectPath, options.ignorePath);

  if (existsSync(projectIgnorePath)) {
    const ignoreContext = readFileSync(projectIgnorePath)
      .toString()
      .replace(/\/$/gm, "");
    ignoreFile.add(ignoreContext);
  }
};

/** 获取配置选项 */
export const getOptions = () => options;
