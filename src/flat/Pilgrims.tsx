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
      tint: TINTS[Math.floor(random(`t-${i}`) * TINTS.length)],
      raised: random(`h-${i}`) > 0.86,
    };
  });

/** One pilgrim in ihram: a head, a draped body, and on a few, raised hands. */
const Figure: React.FC<{ f: Figure }> = ({ f }) => (
  <g
    transform={`translate(${f.x} ${f.y - f.bob}) scale(${f.scale}) rotate(${f.lean} 0 0)`}
    opacity={0.55 + f.depth * 0.28}
  >
    <ellipse cx="0" cy="3" rx="20" ry="5.5" fill="rgba(4,12,28,0.32)" />
    <path
      d="M -15 0 C -15 -34 -13 -62 -10 -84 C -8 -98 -5 -104 0 -104
         C 5 -104 8 -98 10 -84 C 13 -62 15 -34 15 0 Z"
      fill={f.tint}
    />
    <path
      d="M -10 -84 C -3 -78 3 -78 10 -84 L 8 -66 C 2 -61 -2 -61 -8 -66 Z"
      fill="rgba(20,40,80,0.1)"
    />
    {f.raised ? (
      <>
        <path d="M -10 -86 L -17 -122" stroke={f.tint} strokeWidth="6" strokeLinecap="round" />
        <path d="M 10 -86 L 17 -122" stroke={f.tint} strokeWidth="6" strokeLinecap="round" />
      </>
    ) : null}
    <circle cx="0" cy="-114" r="11" fill={f.tint} />
  </g>
);

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
