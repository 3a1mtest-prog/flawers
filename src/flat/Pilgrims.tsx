import { random } from "remotion";

const COUNT = 72;
const CX = 540;
const CY = 1372;
const RX = 520;
const RY = 148;

type Figure = {
  i: number;
  angle: number;
  x: number;
  y: number;
  scale: number;
  depth: number;
};

const layout = (seconds: number): Figure[] =>
  Array.from({ length: COUNT }, (_, i) => {
    const ring = i % 3;
    const rx = RX * (0.62 + ring * 0.19);
    const ry = RY * (0.62 + ring * 0.19);
    const speed = 0.2 - ring * 0.04;
    const angle = random(`p-${i}`) * Math.PI * 2 + seconds * speed;

    // sin(angle) > 0 means the figure is on the near side of the ring
    const depth = Math.sin(angle);
    return {
      i,
      angle,
      x: CX + Math.cos(angle) * rx,
      y: CY + depth * ry,
      scale: 0.62 + (depth + 1) * 0.29,
      depth,
    };
  });

/** One pilgrim in ihram, reduced to a head and a draped body. */
const Figure: React.FC<{ f: Figure; tint: string }> = ({ f, tint }) => (
  <g
    transform={`translate(${f.x} ${f.y}) scale(${f.scale})`}
    opacity={0.55 + f.depth * 0.28}
  >
    <ellipse cx="0" cy="3" rx="20" ry="5.5" fill="rgba(4,12,28,0.35)" />
    {/* draped ihram: narrow shoulders widening to the hem */}
    <path
      d="M -15 0 C -15 -34 -13 -62 -10 -84 C -8 -98 -5 -104 0 -104
         C 5 -104 8 -98 10 -84 C 13 -62 15 -34 15 0 Z"
      fill={tint}
    />
    {/* the sheet over one shoulder */}
    <path d="M -10 -84 C -3 -78 3 -78 10 -84 L 8 -66 C 2 -61 -2 -61 -8 -66 Z" fill="rgba(0,0,0,0.09)" />
    <circle cx="0" cy="-114" r="11" fill={tint} />
  </g>
);

/**
 * The ring of pilgrims. Split into the far half and the near half so the Kaaba
 * can sit between them and the circle actually reads as going *around* it.
 */
export const Pilgrims: React.FC<{ seconds: number; side: "back" | "front"; tint: string }> = ({
  seconds,
  side,
  tint,
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
        <Figure key={f.i} f={f} tint={tint} />
      ))}
    </svg>
  );
};
