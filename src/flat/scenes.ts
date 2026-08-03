import { interpolate } from "remotion";

export type SceneName = "hero" | "topDown" | "rising";

/**
 * The reel is cut into four beats. Each one is held for a stretch and
 * cross-faded into the next, so the composition changes with the narration
 * instead of sitting on one framing for the whole 25 seconds.
 */
export const BEATS: { scene: SceneName; from: number; to: number }[] = [
  { scene: "hero", from: 0, to: 9.8 },
  { scene: "topDown", from: 9.8, to: 13.3 },
  { scene: "rising", from: 13.3, to: 16.3 },
  { scene: "hero", from: 16.3, to: 25 },
];

const FADE = 0.55;

/** Combined opacity of every beat that shows `scene`, at `seconds`. */
export const sceneOpacity = (scene: SceneName, seconds: number): number =>
  BEATS.filter((b) => b.scene === scene).reduce((max, b) => {
    const value = interpolate(
      seconds,
      [b.from - FADE, b.from + FADE, b.to - FADE, b.to + FADE],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    return Math.max(max, value);
  }, 0);

/** 0→1 across the beat that is currently showing `scene`, for local motion. */
export const sceneProgress = (scene: SceneName, seconds: number): number => {
  const active =
    BEATS.find((b) => b.scene === scene && seconds >= b.from - FADE && seconds <= b.to + FADE) ??
    BEATS.find((b) => b.scene === scene);

  if (!active) return 0;
  return interpolate(seconds, [active.from - FADE, active.to + FADE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};
