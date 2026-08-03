import { AbsoluteFill } from "remotion";

/**
 * The aged paper backdrop: a warm base, uneven staining, fibre grain
 * from an SVG turbulence filter, and a vignette to keep the eye centred.
 */
export const Parchment: React.FC = () => {
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#ece0c4" }} />

      <AbsoluteFill
        style={{
          backgroundImage: [
            "radial-gradient(60% 40% at 22% 18%, rgba(255,252,243,0.85) 0%, rgba(255,252,243,0) 60%)",
            "radial-gradient(45% 35% at 82% 30%, rgba(214,196,160,0.55) 0%, rgba(214,196,160,0) 65%)",
            "radial-gradient(70% 45% at 50% 96%, rgba(176,152,113,0.5) 0%, rgba(176,152,113,0) 70%)",
            "radial-gradient(40% 30% at 12% 72%, rgba(200,180,143,0.45) 0%, rgba(200,180,143,0) 70%)",
          ].join(","),
        }}
      />

      <svg
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.14,
          mixBlendMode: "multiply",
        }}
        width="100%"
        height="100%"
      >
        <filter id="paper-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={4}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-grain)" />
      </svg>

      <svg
        style={{ position: "absolute", inset: 0, opacity: 0.16, mixBlendMode: "multiply" }}
        width="100%"
        height="100%"
      >
        <filter id="paper-fibre">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.06" numOctaves={3} />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.35" intercept="0.55" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-fibre)" />
      </svg>

      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(78% 58% at 50% 45%, rgba(0,0,0,0) 50%, rgba(103,76,38,0.2) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
