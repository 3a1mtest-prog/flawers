import { AbsoluteFill, Easing, OffthreadVideo, interpolate } from "remotion";
import type { Shot as ShotSpec } from "./beats";

/** Height of the sharp band: the clips are 832×464, shown at full frame width. */
export const BAND_HEIGHT = Math.round((1080 * 464) / 832);
export const BAND_TOP = 452;

/**
 * One shot. The footage is landscape and the frame is vertical, so rather than
 * blowing the clip up four times to fill the frame, it plays sharp in a band
 * with a heavily blurred copy of itself behind — the frame stays full without
 * throwing away resolution.
 */
export const Shot: React.FC<{ shot: ShotSpec; progress: number; fps: number }> = ({
  shot,
  progress,
  fps,
}) => {
  const eased = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.32, 0, 0.28, 1),
  });

  const scale = interpolate(eased, [0, 1], shot.punch);
  const x = interpolate(eased, [0, 1], [shot.pan[0][0], shot.pan[1][0]]);
  const y = interpolate(eased, [0, 1], [shot.pan[0][1], shot.pan[1][1]]);

  const video = (style: React.CSSProperties) => (
    <OffthreadVideo
      src={shot.clip}
      trimBefore={shot.trim > 0 ? Math.round(shot.trim * fps) : undefined}
      playbackRate={shot.rate}
      muted
      style={style}
    />
  );

  return (
    <AbsoluteFill>
      {/* ambient backdrop: the same frame, blurred and pushed back */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {video({
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(58px) saturate(0.7) brightness(0.62)",
          scale: "1.25",
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "rgba(6,9,16,0.3)" }} />

      {/* the sharp band */}
      <div
        style={{
          position: "absolute",
          insetInline: 0,
          top: BAND_TOP,
          height: BAND_HEIGHT,
          overflow: "hidden",
        }}
      >
        {video({
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: `${scale}`,
          translate: `${x}% ${y}%`,
        })}

        {/* the band's own edges catch a little light */}
        <AbsoluteFill
          style={{
            boxShadow: "inset 0 0 90px rgba(0,0,0,0.55)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* hairlines top and bottom of the band */}
      {[BAND_TOP - 1, BAND_TOP + BAND_HEIGHT].map((top) => (
        <div
          key={top}
          style={{
            position: "absolute",
            insetInline: 0,
            top,
            height: 1,
            background:
              "linear-gradient(90deg, rgba(198,160,92,0) 0%, rgba(226,192,124,0.55) 50%, rgba(198,160,92,0) 100%)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
