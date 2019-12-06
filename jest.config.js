"use strict";

module.exports = {
  clearMocks: true,
  testEnvironment: "node",
  setupFilesAfterEnv: [ "jest-extended" ],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
