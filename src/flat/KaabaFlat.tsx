import { AbsoluteFill, Img } from "remotion";
import { KAABA_SPRITE } from "../sprite-data";

/**
 * The Kaaba, from the generated art. The halo and the warm lift on the cloth
 * are layered on here rather than baked into the sprite, so they can swell with
 * the dua.
 */
export const KaabaFlat: React.FC<{ glow: number }> = ({ glow }) => (
  <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}>
    <AbsoluteFill
      style={{
        backgroundImage:
          "radial-gradient(50% 44% at 50% 52%, rgba(168,208,255,0.5) 0%, rgba(168,208,255,0) 70%)",
        opacity: 0.32 + glow * 0.68,
        scale: "1.5",
      }}
    />

    <Img src={KAABA_SPRITE} style={{ width: "100%", height: "100%", objectFit: "contain" }} />

    {/* warm light gathering on the building as the prayer is spoken */}
    <AbsoluteFill
      style={{
        backgroundImage:
          "radial-gradient(42% 34% at 50% 48%, rgba(255,214,150,0.55) 0%, rgba(255,214,150,0) 72%)",
        mixBlendMode: "soft-light",
        opacity: glow,
      }}
    />
  </div>
);
