import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import { DISPLAY, NASKH } from "../fonts";
import { BRAND, TAGLINE } from "./beats";

/**
 * The closing lockup: the model stands cut out of the last shot, the wordmark
 * rises under a hairline, and the tagline follows. `progress` runs 0→1 across
 * the card.
 */
export const EndCard: React.FC<{ progress: number }> = ({ progress }) => {
  const ease = (from: number, to: number) =>
    interpolate(progress, [from, to], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

  const figure = ease(0, 0.55);
  const mark = ease(0.2, 0.62);
  const rule = ease(0.34, 0.78);
  const tag = ease(0.46, 0.88);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0e15" }}>
      {/* a cold wash behind the figure, so a near-black garment still reads */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(180deg, #131824 0%, #0c1017 52%, #07090e 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(40% 26% at 50% 60%, rgba(178,198,232,0.42) 0%, rgba(12,16,24,0) 72%)",
          opacity: figure,
        }}
      />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end" }}>
        <Img
          src={staticFile("model-full.png")}
          style={{
            height: 980,
            width: "auto",
            marginBottom: 190,
            opacity: figure,
            translate: `0px ${((1 - figure) * 44).toFixed(1)}px`,
            filter: "brightness(1.5) contrast(1.12) drop-shadow(0 14px 64px rgba(120,152,204,0.3))",
          }}
        />
      </AbsoluteFill>

      {/* ground shadow under the figure */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 176,
          width: 460,
          height: 46,
          translate: "-50% 0",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)",
          opacity: figure,
        }}
      />

      {/* wordmark, rising out of a mask */}
      <div
        style={{
          position: "absolute",
          insetInline: 0,
          top: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        <div style={{ overflow: "hidden", paddingBottom: 10 }}>
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 96,
              letterSpacing: "0.16em",
              color: "#f4ead4",
              textShadow: "0 0 70px rgba(226,186,116,0.45)",
              translate: `0px ${((1 - mark) * 118).toFixed(1)}px`,
            }}
          >
            {BRAND}
          </div>
        </div>

        <div
          style={{
            height: 1.5,
            width: `${(rule * 40).toFixed(1)}%`,
            background:
              "linear-gradient(90deg, rgba(214,176,104,0) 0%, rgba(240,210,150,0.95) 50%, rgba(214,176,104,0) 100%)",
          }}
        />

        <div
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: NASKH,
            fontSize: 52,
            color: "#d8cdb6",
            letterSpacing: "0.04em",
            opacity: tag,
            translate: `0px ${((1 - tag) * 18).toFixed(1)}px`,
          }}
        >
          {TAGLINE}
        </div>
      </div>
    </AbsoluteFill>
  );
};
