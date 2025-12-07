const nextJest = require("next/jest");

const createJestConfig = nextJest({
    dir: "./",
});

const customJestConfig = {
    moduleDirectories: ["<rootDir>/node_modules", "node_modules", "<rootDir>/"],
    testEnvironment: "jest-environment-jsdom",
    roots: ["<rootDir>", "<rootDir>/tests"],
    testMatch: ["<rootDir>/tests/**/*.test.{ts,tsx}"],
    moduleNameMapper: {
        "^frontend/src/(.*)$": "<rootDir>/src/$1",
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    coveragePathIgnorePatterns: ["<rootDir>/src/util/", "<rootDir>/src/data/", "<rootDir>/src/react-helpers/"],
    resetMocks: true,
    automock: false,
    setupFiles: ["./setupJest.js"],
    collectCoverage: true,
    coverageReporters: ["text", "lcov", "html"],
    coverageDirectory: "coverage",
};

module.exports = createJestConfig(customJestConfig);
