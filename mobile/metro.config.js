// Learn more https://docs.expo.dev/guides/customizing-metro
const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const repoRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// The product catalogue lives in ../shared and is imported by both the website
// and this app (see src/lib/catalog.ts), so Metro has to watch and bundle from
// outside the project directory.
config.watchFolders = [
  ...(config.watchFolders ?? []),
  path.resolve(repoRoot, "shared"),
];

module.exports = config;
