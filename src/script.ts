export type Line = {
  text: string;
  /** Seconds from the start of the video. */
  from: number;
  /** Seconds. */
  duration: number;
};

/**
 * The narration, timed for a calm delivery of roughly 25 seconds.
 * `from` values leave a short gap between lines so they never overlap.
 */
export const SCRIPT: Line[] = [
  { text: "هنا... تتجه القلوب قبل الأبصار", from: 2.0, duration: 3.8 },
  { text: "وهنا... يذوب كل ما أثقل الروح", from: 6.1, duration: 3.7 },
  { text: "خطواتٌ تدور حول بيت الله", from: 10.0, duration: 3.2 },
  { text: "ودعواتٌ ترتفع إلى السماء", from: 13.4, duration: 2.8 },
  { text: "اللهم ارزقنا زيارة بيتك الحرام", from: 16.4, duration: 3.0 },
  { text: "واكتب لنا طوافًا لا ينقطع أجره", from: 19.6, duration: 2.6 },
  { text: "واجعل قلوبنا معلقةً بك دائمًا", from: 22.4, duration: 2.6 },
];

/** The line where the light swells — "اللهم ارزقنا زيارة بيتك الحرام". */
export const DUA_START = 16.4;

export const TOTAL_SECONDS = 25;
