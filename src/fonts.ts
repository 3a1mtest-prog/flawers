import { AMIRI_REGULAR_WOFF2 } from "./font-data";

export const NASKH = "Amiri";

/**
 * Plain CSS font loading rather than @remotion/fonts' loadFont().
 *
 * loadFont() wraps the FontFace promise in delayRender(), and in this
 * environment's Chromium that promise never settles — the face does render, but
 * the handle is never cleared, so every render longer than the 28s timeout
 * fails. A @font-face rule with an inlined data URI needs no network and no
 * delayRender, so the glyphs are ready well before the first caption at 2s.
 */
export const FONT_FACE_CSS = `
@font-face {
  font-family: '${NASKH}';
  src: url(${AMIRI_REGULAR_WOFF2}) format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: block;
}
`;
