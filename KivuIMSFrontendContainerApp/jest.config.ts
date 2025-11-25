import type { Config } from "jest";

const config: Config = {
  roots: ["<rootDir>/app"],

  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
  collectCoverageFrom: ["app/**/*.{js,jsx,ts,tsx}", "!app/**/*.d.ts"],
  coverageThreshold: {
    global: {
      branches: 35,
      functions: 39,
      lines: 50,
      statements: 50
    }
  },

  setupFilesAfterEnv: ["<rootDir>/app/setupTests.ts"],

  testMatch: [
    "<rootDir>/app/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/app/**/*.{spec,test}.{js,jsx,ts,tsx}"
  ],

  testEnvironment: "jsdom",

  // ✅ Use ts-jest for TypeScript + ESM
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts", ".tsx"],

  // ✅ Transform .ts/.tsx via ts-jest
  transform: {
    "^.+\\.(t|j)sx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json"
      }
    ]
  },

  // ✅ Ignore css/scss transforms, handled by identity-obj-proxy
  transformIgnorePatterns: [
    "/node_modules/(?!(?:.pnpm/)?(@module-federation/utilities|@kivunova/kivufrontendcommon))",
    "^.+\\.module\\.(css|sass|scss)$"
  ],

  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/app/$1",
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|png|jpg|jpeg|svg)$": "<rootDir>/app/fileMock.ts"
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ],

  resetMocks: true
};

export default config;
