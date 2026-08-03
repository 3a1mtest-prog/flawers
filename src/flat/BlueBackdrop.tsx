import { AbsoluteFill, interpolate } from "remotion";
import { NOISE_PNG } from "../noise-data";

/**
 * The blue field the whole reel lives on. `mood` (0–1) walks it from a deep
 * night navy to a lit, open blue as the narration turns from longing to prayer.
 */
export const BlueBackdrop: React.FC<{ mood: number; frame: number }> = ({
  mood,
  frame,
}) => {
  const top = [
    interpolate(mood, [0, 1], [8, 26]),
    interpolate(mood, [0, 1], [26, 96]),
    interpolate(mood, [0, 1], [54, 170]),
  ];
  const bottom = [
    interpolate(mood, [0, 1], [3, 12]),
    interpolate(mood, [0, 1], [10, 44]),
    interpolate(mood, [0, 1], [24, 92]),
  ];

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(175deg, rgb(${top.join(",")}) 0%, rgb(${bottom.join(",")}) 100%)`,
        }}
      />

      {/* glow pooling behind the subject */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(58% 34% at 50% 62%, rgba(${interpolate(
            mood,
            [0, 1],
            [90, 190],
          ).toFixed(0)},${interpolate(mood, [0, 1], [150, 220]).toFixed(0)},255,${interpolate(
            mood,
            [0, 1],
            [0.16, 0.4],
          ).toFixed(3)}) 0%, rgba(0,0,0,0) 70%)`,
        }}
      />

      {/* very light grain so the flat gradient does not band */}
      <AbsoluteFill
        style={{
          backgroundImage: `url(${NOISE_PNG})`,
          backgroundSize: "200px 200px",
          backgroundPosition: `${(frame * 31) % 200}px ${(frame * 47) % 200}px`,
          opacity: 0.03,
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};
