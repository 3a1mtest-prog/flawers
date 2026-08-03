import { AbsoluteFill, random } from "remotion";

const STREAKS = 46;
const SPARKS = 200;

/**
 * Prayer going up: slow vertical streaks and sparks lifting out of the mataf,
 * with silhouetted hands raised at the foot of the frame. Used on the line
 * "ودعواتٌ ترتفع إلى السماء".
 */
export const RisingLight: React.FC<{ local: number; glow: number }> = ({ local, glow }) => {
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="streak" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(200,226,255,0)" />
            <stop offset="45%" stopColor="rgba(214,235,255,0.5)" />
            <stop offset="100%" stopColor="rgba(255,244,214,0)" />
          </linearGradient>
        </defs>

        {Array.from({ length: STREAKS }, (_, i) => {
          const x = 60 + random(`sx-${i}`) * 960;
          const speed = 210 + random(`sv-${i}`) * 300;
          const length = 180 + random(`sl-${i}`) * 420;
          const start = 1560 + random(`s0-${i}`) * 260;
          const y = start - local * speed;

          return (
            <rect
              key={i}
              x={x}
              y={y - length}
              width={2 + random(`sw-${i}`) * 3}
              height={length}
              fill="url(#streak)"
              opacity={0.35 + random(`so-${i}`) * 0.4}
            />
          );
        })}

        {Array.from({ length: SPARKS }, (_, i) => {
          const x = 40 + random(`px-${i}`) * 1000;
          const speed = 150 + random(`pv-${i}`) * 340;
          const y = 1620 + random(`p0-${i}`) * 320 - local * speed;
          const drift = Math.sin(local * 2 + random(`pd-${i}`) * 6.3) * 26;

          return (
            <circle
              key={i}
              cx={x + drift}
              cy={y}
              r={1.6 + random(`pr-${i}`) * 3.4}
              fill="#fff3d4"
              opacity={0.5 + glow * 0.4}
            />
          );
        })}

        {/* raised hands along the bottom edge */}
        {Array.from({ length: 14 }, (_, i) => {
          const x = 60 + i * 74 + random(`hx-${i}`) * 26;
          const h = 150 + random(`hh-${i}`) * 90;
          return (
            <g key={i} opacity="0.55">
              <path
                d={`M ${x} 1920 L ${x} ${1920 - h} Q ${x + 16} ${1920 - h - 34} ${x + 32} ${1920 - h} L ${x + 32} 1920 Z`}
                fill="rgba(226,238,255,0.5)"
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
