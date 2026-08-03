import { ALMARAI_800_WOFF2, CAIRO_800_WOFF2 } from "./display-font-data";
import { AMIRI_REGULAR_WOFF2 } from "./font-data";

export const NASKH = "Amiri";
export const DISPLAY = "Almarai";
export const DISPLAY_ALT = "Cairo";

/**
 * Plain CSS font loading rather than @remotion/fonts' loadFont().
 *
 * loadFont() wraps the FontFace promise in delayRender(), and in this
 * environment's Chromium that promise never settles — the face does render, but
 * the handle is never cleared, so every render longer than the 28s timeout
 * fails. @font-face rules with inlined data URIs need no network and no
 * delayRender, so the glyphs are ready before the first caption.
 */
export const FONT_FACE_CSS = `
@font-face {
  font-family: '${NASKH}';
  src: url(${AMIRI_REGULAR_WOFF2}) format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: '${DISPLAY}';
  src: url(${ALMARAI_800_WOFF2}) format('woff2');
  font-weight: 800;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: '${DISPLAY_ALT}';
  src: url(${CAIRO_800_WOFF2}) format('woff2');
  font-weight: 800;
  font-style: normal;
  font-display: block;
}
`;
