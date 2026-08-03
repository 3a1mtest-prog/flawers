/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

// This sandbox blocks remotion.media, so Remotion cannot download its own
// Chrome Headless Shell. Reuse the Chromium that ships with the image instead.
const findPreinstalledChromium = () => {
  const fromEnv = process.env.REMOTION_BROWSER_EXECUTABLE;
  if (fromEnv) {
    return fromEnv;
  }

  const root = "/opt/pw-browsers";
  if (!existsSync(root)) {
    return null;
  }

  const candidates = readdirSync(root)
    .filter((entry) => entry.startsWith("chromium_headless_shell-"))
    .map((entry) => join(root, entry, "chrome-linux", "headless_shell"))
    .concat([join(root, "chromium")]);

  return candidates.find((candidate) => existsSync(candidate)) ?? null;
};

const browserExecutable = findPreinstalledChromium();
if (browserExecutable) {
  Config.setBrowserExecutable(browserExecutable);
}

// With more than one render tab, the second one fails to fetch the local font
// files and loadFont()'s delayRender() times out. One tab renders reliably.
Config.setConcurrency(1);

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig(enableTailwind);
