import { random } from "remotion";

const CX = 540;
const CY = 990;
const RINGS = 11;

/**
 * The tawaf seen from directly above: concentric rings of pilgrims turning
 * around the Kaaba, the inner ones faster than the outer. Used on the line
 * "خطواتٌ تدور حول بيت الله", where the circling is the whole point.
 */
export const TopDownTawaf: React.FC<{ seconds: number; glow: number }> = ({
  seconds,
  glow,
}) => {
  const rings = Array.from({ length: RINGS }, (_, ring) => {
    const radius = 190 + ring * 62;
    const count = Math.round(26 + ring * 14);
    const speed = 0.34 - ring * 0.019;

    return {
      ring,
      radius,
      dots: Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + random(`o-${ring}-${i}`) * 0.12 + seconds * speed;
        return {
          i,
          x: CX + Math.cos(angle) * (radius + random(`j-${ring}-${i}`) * 16),
          y: CY + Math.sin(angle) * (radius + random(`k-${ring}-${i}`) * 16),
          r: 6.4 - ring * 0.17,
        };
      }),
    };
  });

  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="mataf" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(214,232,255,0.28)" />
          <stop offset="62%" stopColor="rgba(160,196,244,0.12)" />
          <stop offset="100%" stopColor="rgba(120,160,220,0)" />
        </radialGradient>
        <radialGradient id="centre-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(255,224,168,0.75)" />
          <stop offset="100%" stopColor="rgba(255,224,168,0)" />
        </radialGradient>
      </defs>

      {/* the marble courtyard */}
      <circle cx={CX} cy={CY} r={880} fill="url(#mataf)" />
      {Array.from({ length: RINGS + 3 }, (_, i) => (
        <circle
          key={i}
          cx={CX}
          cy={CY}
          r={150 + i * 62}
          fill="none"
          stroke="rgba(190,216,248,0.09)"
          strokeWidth="1.5"
        />
      ))}

      <circle cx={CX} cy={CY} r={330} fill="url(#centre-glow)" opacity={0.35 + glow * 0.65} />

      {rings.map((r) =>
        r.dots.map((d) => (
          <circle
            key={`${r.ring}-${d.i}`}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill="#f2f7ff"
            opacity={0.9 - r.ring * 0.045}
          />
        )),
      )}

      {/* the Kaaba from above: the roof, its gold band, and the door side */}
      <g transform={`rotate(-14 ${CX} ${CY})`}>
        <rect x={CX - 104} y={CY - 112} width="208" height="224" rx="5" fill="#111116" />
        <rect x={CX - 104} y={CY - 112} width="208" height="224" rx="5" fill="none" stroke="#c9a13f" strokeWidth="7" />
        <rect x={CX - 104} y={CY + 74} width="208" height="11" fill="#c9a13f" />
      </g>
    </svg>
  );
};
