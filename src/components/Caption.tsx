import { Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { NASKH } from "../fonts";

/**
 * One narration line. Rendered inside a <Sequence>, so `useCurrentFrame()`
 * is already local to the line: it fades up, holds, then fades away.
 */
export const Caption: React.FC<{
  text: string;
  durationInFrames: number;
  /** "light" for the night scene, "dark" for the parchment cut. */
  tone?: "light" | "dark";
}> = ({ text, durationInFrames, tone = "light" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = durationInFrames - 0.7 * fps;

  return (
    <Interactive.Div
      name="Caption"
      style={{
        position: "absolute",
        insetInline: 0,
        top: 300,
        display: "flex",
        justifyContent: "center",
        paddingInline: 96,
      }}
    >
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: NASKH,
          fontWeight: 400,
          fontSize: 62,
          lineHeight: 1.75,
          textAlign: "center",
          color: tone === "light" ? "#f6e8c8" : "#3a2c1b",
          textShadow:
            tone === "light"
              ? "0 2px 30px rgba(0,0,0,0.85), 0 0 60px rgba(255,206,130,0.35)"
              : "0 2px 18px rgba(247,232,196,0.9)",
          opacity: interpolate(
            frame,
            [0, 0.8 * fps, out, durationInFrames],
            [0, 1, 1, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear, Easing.linear],
            },
          ),
          translate: interpolate(frame, [0, 1.2 * fps], ["0px 26px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {text}
      </div>
    </Interactive.Div>
  );
};
