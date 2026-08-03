import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BlueBackdrop } from "./flat/BlueBackdrop";
import { BoldCaption } from "./flat/BoldCaption";
import { KaabaFlat } from "./flat/KaabaFlat";
import { Pilgrims } from "./flat/Pilgrims";
import { FONT_FACE_CSS } from "./fonts";
import { DUA_START, SCRIPT } from "./script";

export type TawafReelProps = {
  /** Seconds of held silence before the first line appears. */
  openingHold: number;
};

export const TawafReel: React.FC<TawafReelProps> = ({ openingHold }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const seconds = frame / fps;

  // The scene opens up and lights on "اللهم ارزقنا زيارة بيتك الحرام".
  const glow = interpolate(seconds, [DUA_START, DUA_START + 2.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const mood = interpolate(seconds, [2, DUA_START, DUA_START + 3], [0, 0.45, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070f" }}>
      <style>{FONT_FACE_CSS}</style>

      <BlueBackdrop mood={mood} frame={frame} />

      {/* One slow push-in across the whole reel. */}
      <AbsoluteFill
        style={{
          scale: interpolate(frame, [0, durationInFrames], [1, 1.14], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.33, 0, 0.25, 1),
            output: "perceptual-scale",
          }),
          translate: interpolate(frame, [0, durationInFrames], ["0px 0px", "0px -54px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.33, 0, 0.25, 1),
          }),
        }}
      >
        {/* the mataf floor the ring stands on */}
        <AbsoluteFill
          style={{
            backgroundImage:
              "radial-gradient(46% 13% at 50% 71.5%, rgba(190,215,245,0.22) 0%, rgba(190,215,245,0) 72%)",
          }}
        />

        {/* far half of the ring, then the building, then the near half */}
        <Pilgrims seconds={seconds} side="back" tint="#b9cfe8" />

        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            opacity: interpolate(seconds, [1.6, 4.2], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            translate: interpolate(seconds, [1.6, 5], ["0px 46px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <div style={{ width: 620, marginBottom: 560 }}>
            <KaabaFlat glow={glow} />
          </div>
        </AbsoluteFill>

        <Pilgrims seconds={seconds} side="front" tint="#eef4fb" />
      </AbsoluteFill>

      {SCRIPT.map((line) => (
        <Sequence
          key={line.text}
          from={Math.round((openingHold + line.from - 2) * fps)}
          durationInFrames={Math.round(line.duration * fps)}
          layout="none"
        >
          <BoldCaption
            text={line.text}
            durationInFrames={Math.round(line.duration * fps)}
          />
        </Sequence>
      ))}

      {/* fade from black at the open, back to black at the close */}
      <AbsoluteFill
        style={{
          backgroundColor: "#05070f",
          opacity: interpolate(
            frame,
            [0, 1.5 * fps, durationInFrames - 2.2 * fps, durationInFrames],
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
