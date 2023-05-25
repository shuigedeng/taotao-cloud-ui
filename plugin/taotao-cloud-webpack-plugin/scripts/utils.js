const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

function buildPackageJson(extract = {}) {
  const pkg = require(resolveRootPath("package.json"));

  const attrs = [
    "name",
    "version",
    "description",
    "main",
    "typings",
    "unpkg",
    "jsdelivr",
    "bin",
    "keywords",
    "author",
    "license",
    "repository",
    "bugs",
    "homepage",
    "dependencies",
    "peerDependencies",
  ];

  const npmPkg = {};

  attrs.forEach((key) => {
    npmPkg[key] = pkg[key] || "";
  });

  for (const key in extract) {
    npmPkg[key] = extract[key];
  }

  writeJsonIntoFile("@lib/package.json", npmPkg);
}

function copyFile(src, dest) {
  fs.copyFileSync(transfromFilePath(src), transfromFilePath(dest));
}

async function exec(file, arg = [], options = {}) {
  return new Promise((resolve) => {
    childProcess.spawnSync(file, arg, options);
    resolve();
  });
}

function writeJsonIntoFile(filePath, pkg) {
  fs.writeFileSync(
    transfromFilePath(filePath),
    JSON.stringify(pkg, null, 2),
    "utf8"
  );
}

function resolveRootPath(str) {
  return path.resolve(path.dirname(__dirname), str);
}

function transfromFilePath(filePath) {
  if (filePath[0] === "@") {
    return resolveRootPath(filePath.substr(1));
  }
  return filePath;
}

module.exports = {
  buildPackageJson,
  copyFile,
  exec,
  writeJsonIntoFile,
  resolveRootPath,
  transfromFilePath,
};
