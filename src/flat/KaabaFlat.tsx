import { random } from "remotion";

/** Evenly spaced diamonds along the hizam. */
const MOTIFS = Array.from({ length: 15 }, (_, i) => 74 + i * 13.4);

/** Suggested calligraphy: short strokes of varying length, not real letters. */
const CALLIGRAPHY = Array.from({ length: 34 }, (_, i) => ({
  i,
  x: 74 + random(`kx-${i}`) * 178,
  y: 112 + random(`ky-${i}`) * 46,
  w: 10 + random(`kw-${i}`) * 26,
}));

/** Vertical folds in the cloth, denser toward the shaded edge. */
const FOLDS = Array.from({ length: 9 }, (_, i) => ({
  i,
  x: 78 + i * 21 + random(`fx-${i}`) * 5,
  o: 0.05 + random(`fo-${i}`) * 0.07,
}));

/**
 * The Kaaba as a flat illustration: cloth folds, an embroidered hizam with
 * suggested calligraphy, the ornate door, and the marble base it stands on.
 * Drawn in a 360×420 viewBox.
 */
export const KaabaFlat: React.FC<{ glow: number }> = ({ glow }) => {
  return (
    <svg viewBox="0 0 360 420" width="100%" height="100%">
      <defs>
        <linearGradient id="k-front" x1="0" y1="0" x2="1" y2="0.25">
          <stop offset="0%" stopColor="#2a2932" />
          <stop offset="55%" stopColor="#191922" />
          <stop offset="100%" stopColor="#101018" />
        </linearGradient>
        <linearGradient id="k-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0e0e14" />
          <stop offset="100%" stopColor="#050509" />
        </linearGradient>
        <linearGradient id="k-top" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#43414f" />
          <stop offset="100%" stopColor="#26252e" />
        </linearGradient>
        <linearGradient id="k-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5dc9a" />
          <stop offset="30%" stopColor="#d9b355" />
          <stop offset="62%" stopColor="#b08a2c" />
          <stop offset="100%" stopColor="#e2c069" />
        </linearGradient>
        <linearGradient id="k-door" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f2d894" />
          <stop offset="45%" stopColor="#c7a03a" />
          <stop offset="100%" stopColor="#e8cc7d" />
        </linearGradient>
        <linearGradient id="k-marble" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e7e0cf" />
          <stop offset="100%" stopColor="#b9b0a0" />
        </linearGradient>
        <radialGradient id="k-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(168,208,255,0.5)" />
          <stop offset="100%" stopColor="rgba(168,208,255,0)" />
        </radialGradient>
      </defs>

      <ellipse cx="180" cy="215" rx="215" ry="235" fill="url(#k-halo)" opacity={0.32 + glow * 0.68} />
      <ellipse cx="188" cy="374" rx="158" ry="21" fill="rgba(4,14,34,0.45)" />

      {/* marble plinth */}
      <polygon points="52,352 74,340 322,340 300,352" fill="url(#k-marble)" opacity="0.9" />
      <rect x="52" y="352" width="248" height="12" fill="#9d9483" />
      <polygon points="300,352 322,340 322,352 300,364" fill="#8a8171" />

      {/* the cube */}
      <polygon points="66,96 116,64 316,64 266,96" fill="url(#k-top)" />
      <polygon points="266,96 316,64 316,336 266,368" fill="url(#k-side)" />
      <rect x="66" y="96" width="200" height="272" fill="url(#k-front)" />

      {/* cloth folds on the lit face */}
      {FOLDS.map((f) => (
        <rect key={f.i} x={f.x} y="96" width="2.5" height="272" fill="#ffffff" opacity={f.o} />
      ))}

      {/* hizam */}
      <rect x="66" y="164" width="200" height="40" fill="url(#k-band)" />
      <polygon points="266,164 316,132 316,172 266,204" fill="#b0891f" />
      <rect x="66" y="164" width="200" height="2.5" fill="rgba(255,246,214,0.75)" />
      <rect x="66" y="201.5" width="200" height="2.5" fill="rgba(120,86,14,0.6)" />
      {MOTIFS.map((x) => (
        <rect
          key={x}
          x={x}
          y="180"
          width="7"
          height="7"
          fill="rgba(78,55,10,0.55)"
          transform={`rotate(45 ${x + 3.5} 183.5)`}
        />
      ))}

      {/* calligraphy above the band */}
      {CALLIGRAPHY.map((c) => (
        <rect key={c.i} x={c.x} y={c.y} width={c.w} height="2.2" rx="1" fill="rgba(206,176,104,0.16)" />
      ))}

      {/* door */}
      <rect x="190" y="228" width="58" height="120" fill="url(#k-door)" />
      <rect x="197" y="236" width="44" height="104" fill="#7f6318" />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="203"
          y={243 + i * 33}
          width="32"
          height="25"
          fill="none"
          stroke="rgba(246,222,150,0.4)"
          strokeWidth="1.6"
        />
      ))}

      {/* white cloth at the hem */}
      <rect x="66" y="336" width="200" height="18" fill="#e9e3d4" />
      <polygon points="266,336 316,304 316,322 266,354" fill="#cfc9ba" />

      {/* light lifting off the front face during the dua */}
      <rect x="66" y="96" width="200" height="272" fill="rgba(186,220,255,0.13)" opacity={glow} />
      <rect x="66" y="164" width="200" height="40" fill="rgba(255,236,178,0.3)" opacity={glow} />
    </svg>
  );
};
