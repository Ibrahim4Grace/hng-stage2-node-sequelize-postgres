// jest.config.js
export default {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
  moduleFileExtensions: ["js", "ts", "json", "node"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  testTimeout: 200000,
};