/**
 * Prepares the AKHELA'A brand assets.
 *
 * The supplied model cut-out arrived with its transparency flattened onto a
 * checkerboard, so the checker is keyed back out by luminance — the garment is
 * near-black and the checker is neutral and bright, which separates cleanly —
 * and the sheet is then split into its two figures.
 *
 *   node scripts/prepare-brand.mjs
 */
import { Jimp } from "jimp";

/** Above this luminance a neutral pixel is treated as checkerboard. */
const KEY_LUMA = 188;
/** Below this it is fully opaque; between the two the edge is feathered. */
const KEEP_LUMA = 150;
/** Max channel spread for a pixel to count as neutral (the checker is grey). */
const NEUTRAL_SPREAD = 16;
const EMPTY_ALPHA = 10;

const keyCheckerboard = (image) => {
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const { data } = image.bitmap;
    const [r, g, b] = [data[idx], data[idx + 1], data[idx + 2]];
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    const spread = Math.max(r, g, b) - Math.min(r, g, b);

    if (spread > NEUTRAL_SPREAD) return; // coloured — part of the subject

    if (luma >= KEY_LUMA) {
      data[idx + 3] = 0;
    } else if (luma > KEEP_LUMA) {
      data[idx + 3] = Math.round(255 * (1 - (luma - KEEP_LUMA) / (KEY_LUMA - KEEP_LUMA)));
    }
  });
  return image;
};

const columnIsEmpty = (image, x) => {
  const { data, width, height } = image.bitmap;
  for (let y = 0; y < height; y++) {
    if (data[(y * width + x) * 4 + 3] > EMPTY_ALPHA) return false;
  }
  return true;
};

const findSpans = (image, minWidth = 60) => {
  const spans = [];
  let start = null;
  for (let x = 0; x < image.bitmap.width; x++) {
    const empty = columnIsEmpty(image, x);
    if (!empty && start === null) start = x;
    if (empty && start !== null) {
      if (x - start >= minWidth) spans.push([start, x]);
      start = null;
    }
  }
  if (start !== null && image.bitmap.width - start >= minWidth) {
    spans.push([start, image.bitmap.width]);
  }
  return spans;
};

const trimVertically = (image) => {
  const { width, height, data } = image.bitmap;
  const rowIsEmpty = (y) => {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > EMPTY_ALPHA) return false;
    }
    return true;
  };
  let top = 0;
  let bottom = height - 1;
  while (top < height && rowIsEmpty(top)) top++;
  while (bottom > top && rowIsEmpty(bottom)) bottom--;
  return image.crop({ x: 0, y: top, w: width, h: bottom - top + 1 });
};

const main = async () => {
  const sheet = keyCheckerboard(await Jimp.read("assets/brand/model-cutout.png"));
  const spans = findSpans(sheet);
  console.log(`cut-out sheet: ${spans.length} figures`);

  for (const [index, [from, to]] of spans.entries()) {
    const figure = trimVertically(
      sheet.clone().crop({ x: from, y: 0, w: to - from, h: sheet.bitmap.height }),
    );
    const name = index === 0 ? "model-full" : "model-close";
    await figure.write(`public/${name}.png`);
    console.log(`  ${name}.png  ${figure.bitmap.width}x${figure.bitmap.height}`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
