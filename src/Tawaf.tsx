import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Caption } from "./components/Caption";
import { Kaaba } from "./components/Kaaba";
import { LightParticles } from "./components/LightParticles";
import { Parchment } from "./components/Parchment";
import { TawafPath } from "./components/TawafPath";
import { FONT_FACE_CSS } from "./fonts";
import { DUA_START, SCRIPT } from "./script";

export type TawafProps = {
  /** Seconds of held silence before the first line appears. */
  openingHold: number;
};

export const Tawaf: React.FC<TawafProps> = ({ openingHold }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const seconds = frame / fps;

  // The light swells on "اللهم ارزقنا زيارة بيتك الحرام" and stays lifted.
  const glow = interpolate(seconds, [DUA_START, DUA_START + 2.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0a06" }}>
      <style>{FONT_FACE_CSS}</style>

      {/* Everything below sits inside the camera, which pushes in slowly throughout. */}
      <AbsoluteFill
        style={{
          scale: interpolate(frame, [0, durationInFrames], [1, 1.16], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.33, 0, 0.25, 1),
            output: "perceptual-scale",
          }),
          translate: interpolate(
            frame,
            [0, durationInFrames],
            ["0px 0px", "0px -70px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.33, 0, 0.25, 1),
            },
          ),
        }}
      >
        <Parchment />

        <AbsoluteFill
          style={{
            opacity: interpolate(seconds, [1.4, 9.2], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <TawafPath
            progress={interpolate(seconds, [1.4, 9.2], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.4, 0, 0.3, 1),
            })}
            opacity={1}
          />
        </AbsoluteFill>

        {/* The Kaaba rises into place once the path has reached it. */}
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            opacity: interpolate(seconds, [3.4, 6.4], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            translate: interpolate(seconds, [3.4, 7.0], ["0px 40px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <div style={{ width: 720, marginBottom: 150 }}>
            <Kaaba glow={glow} />
          </div>
        </AbsoluteFill>

        {/* Warm wash over the whole frame during the dua. */}
        <AbsoluteFill
          style={{
            backgroundImage:
              "radial-gradient(52% 36% at 50% 70%, rgba(255,224,152,0.32) 0%, rgba(255,224,152,0) 74%)",
            opacity: glow,
          }}
        />

        <LightParticles intensity={0.18 + glow * 0.82} />
      </AbsoluteFill>

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

      {/* Fade from black at the open, back to black at the close. */}
      <AbsoluteFill
        style={{
          backgroundColor: "#0d0a06",
          opacity: interpolate(
            frame,
            [0, 1.6 * fps, durationInFrames - 2.2 * fps, durationInFrames],
            [1, 0, 0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: [Easing.bezier(0.4, 0, 0.2, 1), Easing.linear, Easing.bezier(0.4, 0, 0.2, 1)],
            },
          ),
        }}
      />
    </AbsoluteFill>
  );
};
