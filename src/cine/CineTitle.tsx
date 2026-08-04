import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DISPLAY, NASKH } from "../fonts";

/**
 * A title card in the cinematic register: the line rises out of a mask behind a
 * hairline rule, holds, and lifts away. Meant to be placed inside a
 * <Sequence>, so the frame is local to the line.
 */
export const CineTitle: React.FC<{
  text: string;
  durationInFrames: number;
  /** "hero" for the big statement, "line" for narration, "mark" for a logo lockup. */
  variant?: "hero" | "line" | "mark";
  align?: "center" | "bottom";
}> = ({ text, durationInFrames, variant = "line", align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inn = 0.85 * fps;
  const out = durationInFrames - 0.6 * fps;

  const reveal = interpolate(frame, [0, inn], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(
    frame,
    [0, 0.4 * fps, out, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const size = variant === "hero" ? 108 : variant === "mark" ? 62 : 76;

  return (
    <div
      style={{
        position: "absolute",
        insetInline: 0,
        ...(align === "bottom" ? { bottom: 300 } : { top: 0, bottom: 0 }),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingInline: 96,
        gap: 26,
        opacity,
      }}
    >
      {/* the line is masked, so it appears to rise out of the frame */}
      <div style={{ overflow: "hidden", paddingBottom: 12 }}>
        <div
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: variant === "mark" ? NASKH : DISPLAY,
            fontWeight: variant === "mark" ? 400 : 800,
            fontSize: size,
            lineHeight: 1.4,
            textAlign: "center",
            color: "#fdf6e6",
            letterSpacing: variant === "mark" ? "0.06em" : undefined,
            textShadow: "0 4px 40px rgba(0,0,0,0.7), 0 0 90px rgba(255,206,140,0.3)",
            translate: `0px ${((1 - reveal) * (size * 1.5)).toFixed(1)}px`,
          }}
        >
          {text}
        </div>
      </div>

      {/* hairline rule, drawn out from the centre under the line */}
      <div
        style={{
          height: 1.5,
          width: `${(reveal * (variant === "hero" ? 46 : 30)).toFixed(1)}%`,
          background:
            "linear-gradient(90deg, rgba(214,176,104,0) 0%, rgba(238,208,148,0.95) 50%, rgba(214,176,104,0) 100%)",
        }}
      />
    </div>
  );
};
