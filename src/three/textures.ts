import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from "three";
import { random } from "remotion";

const makeCanvas = (w: number, h: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return { canvas, ctx: canvas.getContext("2d")! };
};

const finish = (canvas: HTMLCanvasElement): Texture => {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
};

/** Repeating diamond-and-rosette motif along the gold band. */
const drawBandOrnament = (
  ctx: CanvasRenderingContext2D,
  y: number,
  bandHeight: number,
  width: number,
) => {
  const gradient = ctx.createLinearGradient(0, y, 0, y + bandHeight);
  gradient.addColorStop(0, "#e8c979");
  gradient.addColorStop(0.35, "#c9a03c");
  gradient.addColorStop(0.7, "#9d7722");
  gradient.addColorStop(1, "#d8b558");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, y, width, bandHeight);

  ctx.strokeStyle = "rgba(255,240,196,0.65)";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, y + 3, width, bandHeight - 6);

  // the motif itself, evenly spaced across the band
  ctx.fillStyle = "rgba(74,52,10,0.55)";
  const step = 34;
  for (let x = step / 2; x < width; x += step) {
    const cy = y + bandHeight / 2;
    ctx.beginPath();
    ctx.moveTo(x, cy - 8);
    ctx.lineTo(x + 8, cy);
    ctx.lineTo(x, cy + 8);
    ctx.lineTo(x - 8, cy);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + step / 2, cy, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
};

/**
 * One face of the kiswah: woven black cloth, the gold hizam band, and — when
 * `withDoor` is set — the door baked in at its real off-centre position. Baking
 * it into the texture avoids a separate plane z-fighting with the band.
 */
export const kiswahTexture = (withDoor: boolean): Texture => {
  const W = 512;
  const H = 560;
  const { canvas, ctx } = makeCanvas(W, H);

  ctx.fillStyle = "#0a0a0c";
  ctx.fillRect(0, 0, W, H);

  // vertical weave: faint lighter threads
  for (let x = 0; x < W; x += 3) {
    ctx.fillStyle = `rgba(255,255,255,${0.012 + random(`weave-${x}`) * 0.022})`;
    ctx.fillRect(x, 0, 1, H);
  }

  // large calligraphic blocks, suggested rather than spelled out
  ctx.fillStyle = "rgba(190,160,90,0.09)";
  for (let i = 0; i < 26; i++) {
    const x = random(`cx-${i}`) * W;
    const y = 90 + random(`cy-${i}`) * (H - 260);
    ctx.fillRect(x, y, 30 + random(`cw-${i}`) * 60, 3);
  }

  drawBandOrnament(ctx, H * 0.24, 44, W);

  // a narrower band low on the cloth
  ctx.fillStyle = "rgba(190,155,70,0.35)";
  ctx.fillRect(0, H * 0.82, W, 6);

  if (withDoor) {
    const dw = 78;
    const dh = 168;
    const dx = W * 0.62;
    const dy = H * 0.42;

    const frame = ctx.createLinearGradient(dx, dy, dx + dw, dy + dh);
    frame.addColorStop(0, "#e6c574");
    frame.addColorStop(0.5, "#b8922f");
    frame.addColorStop(1, "#e0bb63");
    ctx.fillStyle = frame;
    ctx.fillRect(dx - 8, dy - 8, dw + 16, dh + 16);

    ctx.fillStyle = "#8a6a1c";
    ctx.fillRect(dx, dy, dw, dh);

    ctx.strokeStyle = "rgba(255,236,180,0.5)";
    ctx.lineWidth = 2;
    for (let i = 1; i < 4; i++) {
      ctx.strokeRect(dx + 6, dy + 6 + (i - 1) * (dh / 3), dw - 12, dh / 3 - 12);
    }
  }

  return finish(canvas);
};

/** Polished marble with concentric courses radiating from the building. */
export const marbleTexture = (): Texture => {
  const S = 1024;
  const { canvas, ctx } = makeCanvas(S, S);

  ctx.fillStyle = "#cfc9bb";
  ctx.fillRect(0, 0, S, S);

  // concentric rings of paving
  ctx.strokeStyle = "rgba(120,112,98,0.4)";
  ctx.lineWidth = 2;
  for (let r = 24; r < S; r += 26) {
    ctx.beginPath();
    ctx.arc(S / 2, S / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // radial joints
  ctx.strokeStyle = "rgba(120,112,98,0.28)";
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(S / 2, S / 2);
    ctx.lineTo(S / 2 + Math.cos(a) * S, S / 2 + Math.sin(a) * S);
    ctx.stroke();
  }

  // veining
  ctx.strokeStyle = "rgba(90,84,74,0.16)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 160; i++) {
    ctx.beginPath();
    const x = random(`vx-${i}`) * S;
    const y = random(`vy-${i}`) * S;
    ctx.moveTo(x, y);
    ctx.lineTo(x + (random(`vdx-${i}`) - 0.5) * 180, y + (random(`vdy-${i}`) - 0.5) * 180);
    ctx.stroke();
  }

  const texture = finish(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
};
