"use strict";

const { join } = require("path");

module.exports = {
  env: {
    "jest/globals": true
  },
  parserOptions: {
    project: join(__dirname, "./tsconfig.json"),
  },
  plugins: [ "jest" ],

  rules: {
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error"
  }
}
