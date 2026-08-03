import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";

const COUNT = 70;

/**
 * Dust caught in the light. Every particle is seeded from `random()` so the
 * field is identical on every render, and drifts upward at its own pace.
 * `intensity` (0–1) fades the whole field in as the dua begins.
 */
export const LightParticles: React.FC<{ intensity: number }> = ({ intensity }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  return (
    <AbsoluteFill>
      {Array.from({ length: COUNT }, (_, i) => {
        const startX = random(`x-${i}`) * width;
        const startY = random(`y-${i}`) * height;
        const size = 2 + random(`s-${i}`) * 6;
        const speed = 14 + random(`v-${i}`) * 34;
        const sway = 18 + random(`w-${i}`) * 40;
        const phase = random(`p-${i}`) * Math.PI * 2;
        const seconds = frame / fps;

        // Wrap around the top so the field never empties out.
        const y = (((startY - seconds * speed) % height) + height) % height;
        const x = startX + Math.sin(seconds * 0.6 + phase) * sway;
        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(seconds * 1.7 + phase));

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: "rgba(255,241,205,0.95)",
              boxShadow: "0 0 12px 4px rgba(255,226,158,0.55)",
              opacity: twinkle * intensity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
