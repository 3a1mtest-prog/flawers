import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Caption } from "./components/Caption";
import { FONT_FACE_CSS } from "./fonts";
import { NOISE_PNG } from "./noise-data";
import { DUA_START, SCRIPT } from "./script";
import { Scene } from "./three/Scene";

export type TawafCinematicProps = {
  /** Seconds of held silence before the first line appears. */
  openingHold: number;
};

export const TawafCinematic: React.FC<TawafCinematicProps> = ({ openingHold }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const seconds = frame / fps;
  const t = frame / durationInFrames;

  // The light swells on "اللهم ارزقنا زيارة بيتك الحرام" and stays lifted.
  const glow = interpolate(seconds, [DUA_START, DUA_START + 2.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070d" }}>
      <style>{FONT_FACE_CSS}</style>

      {/* night sky behind the transparent canvas */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(180deg, #060812 0%, #0b1020 42%, #1b1c22 72%, #35291c 100%)",
        }}
      />

      <ThreeCanvas width={width} height={height} style={{ position: "absolute" }}>
        <Scene seconds={seconds} t={t} glow={glow} />
      </ThreeCanvas>

      {/* bloom wash — fakes the halo a post pass would give us */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(46% 26% at 50% 62%, rgba(255,206,130,0.55) 0%, rgba(255,206,130,0) 70%)",
          mixBlendMode: "screen",
          opacity: 0.35 + glow * 0.65,
        }}
      />

      {/* film grain: a tiled noise bitmap nudged each frame, cheap to render */}
      <AbsoluteFill
        style={{
          backgroundImage: `url(${NOISE_PNG})`,
          backgroundSize: "220px 220px",
          backgroundPosition: `${(frame * 37) % 220}px ${(frame * 53) % 220}px`,
          opacity: 0.055,
          mixBlendMode: "overlay",
        }}
      />

      {/* vignette */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(72% 52% at 50% 48%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      {SCRIPT.map((line) => (
        <Sequence
          key={line.text}
          from={Math.round((openingHold + line.from - 2) * fps)}
          durationInFrames={Math.round(line.duration * fps)}
          layout="none"
        >
          <Caption text={line.text} durationInFrames={Math.round(line.duration * fps)} />
        </Sequence>
      ))}

      {/* fade from black at the open, back to black at the close */}
      <AbsoluteFill
        style={{
          backgroundColor: "#05070d",
          opacity: interpolate(
            frame,
            [0, 1.8 * fps, durationInFrames - 2.4 * fps, durationInFrames],
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
    </AbsoluteFill>
  );
};
