import { AbsoluteFill, Easing, interpolate } from "remotion";

/**
 * A light leak sweeping across the cut. Placed at a shot boundary it hides the
 * seam and reads as an optical transition rather than a dissolve.
 */
export const LightLeak: React.FC<{ progress: number; tint?: string }> = ({
  progress,
  tint = "255,206,150",
}) => {
  const sweep = interpolate(progress, [0, 1], [-60, 160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const strength = interpolate(progress, [0, 0.5, 1], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(112deg, rgba(${tint},0) ${sweep - 42}%, rgba(${tint},0.85) ${sweep}%, rgba(${tint},0) ${sweep + 42}%)`,
        mixBlendMode: "screen",
        opacity: strength * 0.75,
        pointerEvents: "none",
      }}
    />
  );
};

/**
 * Fade to and from black at the head and tail of a piece.
 * `frame` and the fade lengths are all in frames.
 */
export const Bookend: React.FC<{
  frame: number;
  durationInFrames: number;
  inFrames: number;
  outFrames: number;
  color?: string;
}> = ({ frame, durationInFrames, inFrames, outFrames, color = "#04060b" }) => (
  <AbsoluteFill
    style={{
      backgroundColor: color,
      pointerEvents: "none",
      opacity: interpolate(
        frame,
        [0, inFrames, durationInFrames - outFrames, durationInFrames],
        [1, 0, 0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: [
            Easing.bezier(0.4, 0, 0.2, 1),
            Easing.linear,
            Easing.bezier(0.4, 0, 0.2, 1),
          ],
        },
      ),
    }}
  />
);
