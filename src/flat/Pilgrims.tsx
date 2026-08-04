import { random } from "remotion";

const COUNT = 78;
const CX = 540;
const CY = 1372;
const RX = 520;
const RY = 148;

const TINTS = ["#ffffff", "#eef4fb", "#dfe9f6", "#cfdcee"];

type Figure = {
  i: number;
  x: number;
  y: number;
  scale: number;
  depth: number;
  bob: number;
  lean: number;
  swing: number;
  tint: string;
  raised: boolean;
};

const layout = (seconds: number): Figure[] =>
  Array.from({ length: COUNT }, (_, i) => {
    const ring = i % 3;
    const rx = RX * (0.6 + ring * 0.2);
    const ry = RY * (0.6 + ring * 0.2);
    const speed = 0.2 - ring * 0.042;
    const angle = random(`p-${i}`) * Math.PI * 2 + seconds * speed;
    const depth = Math.sin(angle);

    // A short stride cycle per figure, offset so the crowd never marches in step.
    const stride = seconds * (2.4 + random(`st-${i}`) * 0.7) + random(`ph-${i}`) * 6.3;

    return {
      i,
      x: CX + Math.cos(angle) * rx,
      y: CY + depth * ry,
      scale: 0.6 + (depth + 1) * 0.3,
      depth,
      bob: Math.abs(Math.sin(stride)) * 4.5,
      lean: Math.sin(stride) * 2.4,
      swing: Math.sin(stride) * 4.5,
      tint: TINTS[Math.floor(random(`t-${i}`) * TINTS.length)],
      raised: random(`h-${i}`) > 0.86,
    };
  });

/**
 * One pilgrim. The body is a draped robe with a shoulder wrap and hem folds;
 * `swing` moves the arms with the stride, and a few figures hold their hands
 * up in dua instead.
 */
const Figure: React.FC<{ f: Figure }> = ({ f }) => {
  const shade = "rgba(24,48,92,0.13)";

  return (
    <g
      transform={`translate(${f.x} ${f.y - f.bob}) scale(${f.scale}) rotate(${f.lean} 0 0)`}
      opacity={0.55 + f.depth * 0.28}
    >
      <ellipse cx="0" cy="3" rx="19" ry="5" fill="rgba(4,12,28,0.32)" />

      {/* robe */}
      <path
        d="M -15 0 C -15 -32 -13.5 -60 -10.5 -82 C -9 -96 -5 -103 0 -103
           C 5 -103 9 -96 10.5 -82 C 13.5 -60 15 -32 15 0 Z"
        fill={f.tint}
      />
      {/* hem shadow and folds */}
      <path d="M -15 0 C -8 -6 8 -6 15 0 Z" fill={shade} />
      <path d="M -6 -4 L -4 -58" stroke={shade} strokeWidth="1.6" />
      <path d="M 5 -4 L 4 -52" stroke={shade} strokeWidth="1.4" />

      {/* the sheet thrown over one shoulder */}
      <path d="M -10.5 -82 C -3 -75 3 -75 10.5 -82 L 9 -60 C 2 -54 -2 -54 -9 -60 Z" fill={shade} />
      <path d="M -10.5 -82 C -4 -88 4 -88 10.5 -82 L 10 -78 C 4 -83 -4 -83 -10 -78 Z" fill="rgba(255,255,255,0.35)" />

      {f.raised ? (
        <>
          <path d="M -9 -84 L -16 -120" stroke={f.tint} strokeWidth="5.5" strokeLinecap="round" />
          <path d="M 9 -84 L 16 -120" stroke={f.tint} strokeWidth="5.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path
            d={`M -10 -82 L ${-13 - f.swing} ${-44 + Math.abs(f.swing) * 0.8}`}
            stroke={f.tint}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d={`M 10 -82 L ${13 + f.swing} ${-44 + Math.abs(f.swing) * 0.8}`}
            stroke={f.tint}
            strokeWidth="5"
            strokeLinecap="round"
          />
        </>
      )}

      {/* head, with the cloth of the ihram over the crown */}
      <circle cx="0" cy="-112" r="10.5" fill={f.tint} />
      <path d="M -10.5 -114 C -9 -124 9 -124 10.5 -114 C 6 -119 -6 -119 -10.5 -114 Z" fill="rgba(255,255,255,0.4)" />
    </g>
  );
};

/**
 * The ring of pilgrims, split into the far and near halves so the Kaaba can sit
 * between them and the circle reads as going *around* it.
 */
export const Pilgrims: React.FC<{ seconds: number; side: "back" | "front" }> = ({
  seconds,
  side,
}) => {
  const figures = layout(seconds).filter((f) =>
    side === "back" ? f.depth <= 0 : f.depth > 0,
  );

  return (
    <svg
      viewBox="0 0 1080 1920"
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0 }}
    >
      {figures.map((f) => (
        <Figure key={f.i} f={f} />
      ))}
    </svg>
  );
};
