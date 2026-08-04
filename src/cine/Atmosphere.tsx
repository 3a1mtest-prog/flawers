import { AbsoluteFill, random } from "remotion";

const MOTES = 90;
const BOKEH = 22;

/**
 * The air in front of the lens: drifting dust, soft out-of-focus bokeh, and
 * angled shafts of light. Layered over a shot, this is most of what separates a
 * still with a zoom on it from something that reads as filmed.
 */
export const Atmosphere: React.FC<{
  seconds: number;
  /** 0 = clear air, 1 = heavy shafts and dust. */
  density?: number;
  /** Tint of the light, e.g. warm lamplight or cool moonlight. */
  tint?: string;
}> = ({ seconds, density = 1, tint = "255,214,152" }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* light shafts, leaning in from the upper corner */}
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.5 * density }}>
        <svg viewBox="0 0 1080 1920" width="100%" height="100%">
          <defs>
            <linearGradient id="shaft" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stopColor={`rgba(${tint},0.5)`} />
              <stop offset="65%" stopColor={`rgba(${tint},0.12)`} />
              <stop offset="100%" stopColor={`rgba(${tint},0)`} />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((i) => {
            const drift = Math.sin(seconds * 0.22 + i) * 24;
            const x = 120 + i * 240 + drift;
            return (
              <polygon
                key={i}
                points={`${x},-40 ${x + 150},-40 ${x + 420 + i * 40},1960 ${x + 190 + i * 40},1960`}
                fill="url(#shaft)"
                opacity={0.28 + random(`shaft-${i}`) * 0.3}
              />
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* dust catching the light */}
      <AbsoluteFill style={{ mixBlendMode: "screen" }}>
        <svg viewBox="0 0 1080 1920" width="100%" height="100%">
          {Array.from({ length: MOTES }, (_, i) => {
            const speed = 8 + random(`ms-${i}`) * 22;
            const y = (random(`my-${i}`) * 2100 - seconds * speed + 2100) % 2100;
            const x =
              random(`mx-${i}`) * 1080 + Math.sin(seconds * 0.5 + random(`mp-${i}`) * 6.3) * 22;
            return (
              <circle
                key={i}
                cx={x}
                cy={y - 90}
                r={1 + random(`mr-${i}`) * 2.6}
                fill={`rgba(${tint},${(0.3 + random(`mo-${i}`) * 0.5) * density})`}
              />
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* foreground bokeh, large and soft, drifting slowly across the lens */}
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.5 * density }}>
        {Array.from({ length: BOKEH }, (_, i) => {
          const size = 40 + random(`bs-${i}`) * 130;
          const speed = 4 + random(`bv-${i}`) * 12;
          const y = (random(`by-${i}`) * 2200 - seconds * speed + 2200) % 2200;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: random(`bx-${i}`) * 1080 - size / 2,
                top: y - 140,
                width: size,
                height: size,
                borderRadius: "50%",
                background: `radial-gradient(circle, rgba(${tint},${0.16 + random(`bo-${i}`) * 0.2}) 0%, rgba(${tint},0) 70%)`,
                filter: "blur(2px)",
              }}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
