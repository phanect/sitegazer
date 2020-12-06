"use strict";

const { join } = require("path");

module.exports = {
  extends: "plugin:@phanect/ts",

  env: {
    browser: false,
    node: true,
  },
  parserOptions: {
    project: join(__dirname, "./tsconfig.json"),
  },
  plugins: [ "@phanect" ],

  rules: {
    // Do not require return type for callback functions.
    // This setting will be default on next breaking changes.
    // https://github.com/typescript-eslint/typescript-eslint/issues/493
    "@typescript-eslint/explicit-function-return-type": [ "warn", {
      allowExpressions: true,
    }],
    // Dynamic require() is frequently used in this project.
    "@typescript-eslint/no-var-requires": "off",
  }
};
