const {
  buildPackageJson,
  copyFile,
  exec,
  resolveRootPath,
} = require("./utils");

async function build() {
  await exec(
    "node",
    [
      resolveRootPath("node_modules/rollup/dist/bin/rollup"),
      "-c",
      resolveRootPath("rollup.config.js"),
    ],
    { stdio: "inherit" }
  );
}

function copyFiles() {
  copyFile("@LICENSE", "@lib/LICENSE");
  copyFile("@README.md", "@lib/README.md");
}

async function main() {
  await build();
  buildPackageJson();
  copyFiles();
}

main();
