import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Atmosphere } from "./cine/Atmosphere";
import { CineTitle } from "./cine/CineTitle";
import { Grade } from "./cine/Grade";
import { Bookend, LightLeak } from "./cine/Transitions";
import { FONT_FACE_CSS } from "./fonts";
import { END_CARD_AT, LINES, SHOTS } from "./akhelaa/beats";
import { EndCard } from "./akhelaa/EndCard";
import { BAND_HEIGHT, BAND_TOP, Shot } from "./akhelaa/Shot";

/** Cross-fade between shots, in seconds. */
const BLEND = 0.42;

export const AkhelaaAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const seconds = frame / fps;

  // The grade warms up as the weather breaks on the third shot.
  const warmth = interpolate(seconds, [9.6, 12.4], [0.12, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // The card cuts in fast so it reads, then plays its own reveal underneath.
  const endCard = interpolate(seconds, [END_CARD_AT - 0.35, END_CARD_AT + 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardReveal = interpolate(seconds, [END_CARD_AT, END_CARD_AT + 3.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070c" }}>
      <style>{FONT_FACE_CSS}</style>

      {SHOTS.map((shot) => {
        const local = (seconds - shot.from) / shot.duration;
        const opacity = interpolate(
          seconds,
          [
            shot.from - BLEND,
            shot.from + BLEND,
            shot.from + shot.duration - BLEND,
            shot.from + shot.duration + BLEND,
          ],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        if (opacity <= 0) return null;

        return (
          <AbsoluteFill key={shot.id} style={{ opacity }}>
            <Sequence
              from={Math.round(shot.from * fps)}
              durationInFrames={Math.round((shot.duration + BLEND) * fps)}
              layout="none"
            >
              <Shot shot={shot} progress={local} fps={fps} />
            </Sequence>
          </AbsoluteFill>
        );
      })}

      {/* atmosphere sits over the footage but only inside the band */}
      <div
        style={{
          position: "absolute",
          insetInline: 0,
          top: BAND_TOP,
          height: BAND_HEIGHT,
          overflow: "hidden",
          opacity: Math.max(0, 1 - endCard * 2.2),
        }}
      >
        <div style={{ position: "absolute", inset: "-25% 0" }}>
          <Atmosphere
            seconds={seconds}
            density={interpolate(seconds, [9.6, 12.4], [0.35, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
            tint={seconds < 11 ? "196,214,240" : "255,206,146"}
          />
        </div>
      </div>

      {/* light leaks laid over the two hardest cuts */}
      {[10.2, 20.4].map((at) => (
        <LightLeak
          key={at}
          progress={interpolate(seconds, [at - 0.5, at + 0.5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          tint={at > 15 ? "255,214,150" : "200,216,240"}
        />
      ))}

      {LINES.map((line) => (
        <Sequence
          key={line.text}
          from={Math.round(line.from * fps)}
          durationInFrames={Math.round(line.duration * fps)}
          layout="none"
        >
          <CineTitle text={line.text} durationInFrames={Math.round(line.duration * fps)} align="bottom" />
        </Sequence>
      ))}

      <AbsoluteFill style={{ opacity: endCard }}>
        <EndCard progress={cardReveal} />
      </AbsoluteFill>

      <Grade frame={frame} warmth={warmth} contrast={0.5} grain={0.05} />
      <Bookend
        frame={frame}
        durationInFrames={durationInFrames}
        inFrames={Math.round(1.1 * fps)}
        outFrames={Math.round(1.2 * fps)}
      />
    </AbsoluteFill>
  );
};
