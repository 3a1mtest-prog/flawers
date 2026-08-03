const CENTER_X = 540;
const CENTER_Y = 760;
const TURNS = 1.75;
const STEPS = 260;

/**
 * A spiral that tightens and descends, standing in for the circling of the
 * tawaf as seen from above. Built once as a polyline in SVG units.
 */
const spiralPath = () => {
  const points = Array.from({ length: STEPS + 1 }, (_, i) => {
    const t = i / STEPS;
    const angle = -Math.PI / 2 + t * Math.PI * 2 * TURNS;
    const shrink = 1 - 0.46 * t;
    const x = CENTER_X + Math.cos(angle) * 350 * shrink;
    const y = CENTER_Y + Math.sin(angle) * 250 * shrink + t * 300;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return `M ${points.join(" L ")}`;
};

const PATH = spiralPath();

/**
 * `progress` (0–1) reveals the spiral from its start; the dashes themselves are
 * static, so the reveal is done with a mask rather than the dash offset.
 */
export const TawafPath: React.FC<{ progress: number; opacity: number }> = ({
  progress,
  opacity,
}) => {
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ opacity }}>
      <defs>
        <mask id="tawaf-reveal">
          <path
            d={PATH}
            fill="none"
            stroke="white"
            strokeWidth="40"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - progress}
          />
        </mask>
      </defs>

      <path
        d={PATH}
        fill="none"
        stroke="#9a8460"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray="26 32"
        mask="url(#tawaf-reveal)"
      />
    </svg>
  );
};
