import { Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DISPLAY } from "../fonts";

/**
 * The headline treatment from the reference: heavy white Arabic, centred, with
 * a wipe-up reveal behind a mask and a soft blue glow so it holds against the
 * background. Rendered inside a <Sequence>, so the frame is local to the line.
 */
export const BoldCaption: React.FC<{ text: string; durationInFrames: number }> = ({
  text,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = durationInFrames - 0.55 * fps;

  return (
    <Interactive.Div
      name="Headline"
      style={{
        position: "absolute",
        insetInline: 0,
        top: 250,
        display: "flex",
        justifyContent: "center",
        paddingInline: 84,
        opacity: interpolate(frame, [0, 0.35 * fps, out, durationInFrames], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear, Easing.linear],
        }),
      }}
    >
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 84,
          lineHeight: 1.42,
          textAlign: "center",
          color: "#ffffff",
          textShadow:
            "0 6px 40px rgba(0,0,0,0.55), 0 0 90px rgba(120,180,255,0.45)",
          // the mask slides off to reveal the line from the bottom up
          maskImage: "linear-gradient(180deg, #000 0 100%)",
          translate: interpolate(frame, [0, 0.9 * fps], ["0px 34px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [0, 1.1 * fps], [0.94, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        {text}
      </div>
    </Interactive.Div>
  );
};
