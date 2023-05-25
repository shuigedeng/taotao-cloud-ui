const babel = require("@rollup/plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const terser = require("@rollup/plugin-terser");
const typescript = require("@rollup/plugin-typescript");
const dts = require("rollup-plugin-dts");

const { defineConfig } = require("rollup");

const baseConfig = {
  plugins: [
    nodeResolve({
      preferBuiltins: true,
    }),
    commonjs(),
    typescript(),
    babel({
      babelHelpers: "bundled",
      exclude: ["node_modules/**"],
      presets: ["@babel/preset-env"],
    }),
    terser(),
  ],
  external: ["prettier", "eslint"], // 确保模块作为外部依赖项
};

module.exports = defineConfig([
  {
    ...baseConfig,
    input: "src/cli.ts",
    output: {
      file: "lib/cli.js",
      format: "cjs",
    },
  },
  {
    ...baseConfig,
    input: "src/plugin.ts",
    output: {
      file: "lib/plugin.js",
      format: "cjs",
    },
  },
  {
    // 生成 .d.ts 类型声明文件
    input: "src/plugin.ts",
    output: {
      file: "lib/typings.d.ts",
      format: "es",
    },
    plugins: [dts.default()],
  },
]);
