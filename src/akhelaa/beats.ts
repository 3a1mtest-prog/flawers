import { staticFile } from "remotion";

export const AD_SECONDS = 25;

export type Shot = {
  id: string;
  /** Seconds from the head of the piece. */
  from: number;
  duration: number;
  clip: string;
  /** Seconds trimmed off the head of the source clip. */
  trim: number;
  /** Slight slow motion on the held wides. */
  rate: number;
  /** Framing inside the band: scale at the start and end of the shot. */
  punch: [number, number];
  /** Pan inside the band, as a percentage of the band, start → end. */
  pan: [[number, number], [number, number]];
};

/**
 * Five shots cut from two 5.2-second clips. The two wides run slightly slowed;
 * the tighter reframes are trimmed instead, so the same footage reads as a
 * different set-up rather than a repeat.
 *
 * The arc goes fog → solitude → the weather breaking → arrival → the mark.
 */
export const SHOTS: Shot[] = [
  {
    id: "fog-wide",
    from: 0,
    duration: 5.2,
    clip: staticFile("clip-b.mp4"),
    trim: 0,
    rate: 0.9,
    punch: [1.02, 1.12],
    pan: [[0, 0], [0, -2]],
  },
  {
    id: "fog-close",
    from: 5.2,
    duration: 5,
    clip: staticFile("clip-b.mp4"),
    trim: 0.2,
    rate: 1,
    punch: [1.55, 1.72],
    pan: [[10, 2], [2, -2]],
  },
  {
    id: "gold-wide",
    from: 10.2,
    duration: 5.2,
    clip: staticFile("clip-a.mp4"),
    trim: 0,
    rate: 0.9,
    punch: [1.04, 1.14],
    pan: [[0, 0], [0, -3]],
  },
  {
    id: "gold-mark",
    from: 15.4,
    duration: 5,
    clip: staticFile("clip-a.mp4"),
    trim: 0.2,
    rate: 1,
    punch: [1.75, 1.95],
    pan: [[-6, 4], [-2, 0]],
  },
];

/** Where the end card takes over from the footage. */
export const END_CARD_AT = 20.4;

export type Line = { text: string; from: number; duration: number };

export const LINES: Line[] = [
  { text: "ما كل طريق بيبان من أوّله", from: 1.1, duration: 3.6 },
  { text: "وفي مسافات، بتقطعها لحالك", from: 6.1, duration: 3.7 },
  { text: "بس الضباب… بينزاح", from: 11.2, duration: 3.6 },
  { text: "واللي بيكمّل، بيوصل", from: 16.2, duration: 3.5 },
];

export const BRAND = "AKHELA'A";
export const TAGLINE = "لِمَن يمشي أبعد";
