import { AbsoluteFill } from "remotion";
import { NOISE_PNG } from "../noise-data";

/**
 * The finishing pass that sits over everything: a colour grade, halation in the
 * highlights, vignette, film grain and optional letterbox. Kept as one
 * component so every shot in a piece is finished identically.
 */
export const Grade: React.FC<{
  frame: number;
  /** Warmth of the highlights, 0–1. */
  warmth?: number;
  /** Strength of the black crush and vignette, 0–1. */
  contrast?: number;
  /** Height of each bar as a fraction of the frame. 0 disables letterboxing. */
  letterbox?: number;
  grain?: number;
}> = ({ frame, warmth = 0.5, contrast = 0.5, letterbox = 0, grain = 0.055 }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* teal in the shadows, amber in the highlights */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(28,58,92,0.28) 0%, rgba(10,18,32,0.12) 55%, rgba(74,44,18,0.26) 100%)",
          mixBlendMode: "soft-light",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(52% 34% at 50% 44%, rgba(255,196,128,${(0.3 * warmth).toFixed(3)}) 0%, rgba(255,196,128,0) 72%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* vignette */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(74% 54% at 50% 47%, rgba(0,0,0,0) 42%, rgba(0,0,0,${(0.78 * contrast).toFixed(3)}) 100%)`,
        }}
      />

      {/* grain: a tiled bitmap nudged per frame, far cheaper than a live filter */}
      <AbsoluteFill
        style={{
          backgroundImage: `url(${NOISE_PNG})`,
          backgroundSize: "230px 230px",
          backgroundPosition: `${(frame * 41) % 230}px ${(frame * 59) % 230}px`,
          opacity: grain,
          mixBlendMode: "overlay",
        }}
      />

      {letterbox > 0 ? (
        <>
          <div
            style={{
              position: "absolute",
              insetInline: 0,
              top: 0,
              height: `${letterbox * 100}%`,
              backgroundColor: "#000",
            }}
          />
          <div
            style={{
              position: "absolute",
              insetInline: 0,
              bottom: 0,
              height: `${letterbox * 100}%`,
              backgroundColor: "#000",
            }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};
