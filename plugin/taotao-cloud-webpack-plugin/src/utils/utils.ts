import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

import { getOptions, ignoreFile, projectPath } from "../common";
import logger from "../utils/logger";

/** 步骤日志 */
export const step = (msg: string) => logger.success(`\n${msg}`);

/** 首字母转大写 */
export const toPascalCase = (str: string) => {
  return str.replace(/^\w/, (c) => c.toUpperCase());
};

/** 扫描入口路径 */
export const getEntryPath = () => {
  const options = getOptions();
  return resolve(projectPath, (options.entry || "").replace(/^\//, ""));
};

/** 输出文件路径 */
export const getOutputPath = () => {
  const options = getOptions();
  return resolve(projectPath, options.output);
};

/** 获取导入组件Set */
export const getImportedComponents = () => {
  const outputPath = getOutputPath();
  const importedComponents = new Set<string>();
  if (existsSync(outputPath)) {
    const outputContent = readFileSync(outputPath, "utf8");

    // 使用正则表达式匹配 import 语句并提取需要的内容
    const importPattern = /import\s*{([^}]*)}\s*from\s*['"]([^'"]*)['"]/g;
    const matches = outputContent.matchAll(importPattern);

    // 遍历匹配结果
    for (const match of matches) {
      const componentNames = match[1].split(",").map((name) => name.trim());

      // 判断每个组件是否存在，并添加到 importedComponents 集合中
      componentNames.forEach((componentName) => {
        importedComponents.add(componentName);
      });
    }
  }
  return importedComponents;
};

/** 获取vue文件 */
export const getVueFiles = (directory: string) => {
  const files = readdirSync(directory, { withFileTypes: true });

  const vueFiles: string[] = [];

  files.forEach((file) => {
    if (ignoreFile.ignores(file.name)) return;

    const filePath = resolve(directory, file.name);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      vueFiles.push(...getVueFiles(filePath));
    } else if (stat.isFile() && file.name.endsWith(".vue")) {
      logger.path(filePath);
      vueFiles.push(filePath);
    }
  });

  return vueFiles;
};
