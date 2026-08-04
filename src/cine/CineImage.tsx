import { AbsoluteFill, Easing, Img, interpolate } from "remotion";

export type Move = {
  /** Scale at the start and end of the shot. Above 1 crops in. */
  zoom: [number, number];
  /** Pan in frame pixels, as [fromX, fromY] → [toX, toY]. */
  pan: [[number, number], [number, number]];
  /** Slight rotation adds life to an otherwise rigid push. */
  rotate?: [number, number];
};

/** A slow push in, the default for a held hero shot. */
export const PUSH_IN: Move = { zoom: [1.06, 1.24], pan: [[0, 0], [0, -26]] };
/** Pulling back to reveal, good for an opening or a final wide. */
export const PULL_BACK: Move = { zoom: [1.3, 1.08], pan: [[0, -20], [0, 10]] };
/** A lateral drift, for shots where the subject is off-centre. */
export const DRIFT_LEFT: Move = { zoom: [1.16, 1.22], pan: [[46, 0], [-46, -14]] };
export const DRIFT_RIGHT: Move = { zoom: [1.16, 1.22], pan: [[-46, 0], [46, -14]] };

/**
 * One cinematic shot: a still under a slow camera move, with an optional
 * foreground plate that travels faster to give the frame real depth.
 *
 * `progress` runs 0→1 across the shot, so the caller controls pacing and this
 * component stays a pure function of it.
 */
export const CineImage: React.FC<{
  src: string;
  progress: number;
  move?: Move;
  /** Optional cut-out plate composited in front, moving at a multiple of the
   *  base move — this is what sells the parallax. */
  foreground?: { src: string; factor: number };
}> = ({ src, progress, move = PUSH_IN, foreground }) => {
  const eased = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.32, 0, 0.28, 1),
  });

  const zoom = interpolate(eased, [0, 1], move.zoom);
  const x = interpolate(eased, [0, 1], [move.pan[0][0], move.pan[1][0]]);
  const y = interpolate(eased, [0, 1], [move.pan[0][1], move.pan[1][1]]);
  const rotate = move.rotate ? interpolate(eased, [0, 1], move.rotate) : 0;

  const plate = (source: string, factor: number) => (
    <AbsoluteFill
      style={{
        scale: `${1 + (zoom - 1) * factor}`,
        translate: `${x * factor}px ${y * factor}px`,
        rotate: `${rotate * factor}deg`,
      }}
    >
      <Img src={source} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill>
      {plate(src, 1)}
      {foreground ? plate(foreground.src, foreground.factor) : null}
    </AbsoluteFill>
  );
};
