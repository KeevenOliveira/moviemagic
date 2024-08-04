const nextJest = require("next/jest");
import { Config } from "jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  verbose: true,
  preset: "ts-jest/presets/js-with-ts",
  testPathIgnorePatterns: ["./.next/", "./node_modules/"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.jest.json",
    },
  },
};
export default createJestConfig(config);
