const MOTIFS = Array.from({ length: 13 }, (_, i) => 44 + i * 26);

/**
 * Flat-illustration Kaaba: clean shapes, one light source from the upper left,
 * gold hizam with a repeating motif. Sized to a 360×420 viewBox.
 */
export const KaabaFlat: React.FC<{ glow: number }> = ({ glow }) => {
  return (
    <svg viewBox="0 0 360 420" width="100%" height="100%">
      <defs>
        <linearGradient id="face-front" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#25242b" />
          <stop offset="100%" stopColor="#131318" />
        </linearGradient>
        <linearGradient id="face-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0d0d11" />
          <stop offset="100%" stopColor="#06060a" />
        </linearGradient>
        <linearGradient id="face-top" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#3a3944" />
          <stop offset="100%" stopColor="#232229" />
        </linearGradient>
        <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0d489" />
          <stop offset="45%" stopColor="#cfa63f" />
          <stop offset="100%" stopColor="#a37d25" />
        </linearGradient>
        <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(160,205,255,0.55)" />
          <stop offset="100%" stopColor="rgba(160,205,255,0)" />
        </radialGradient>
      </defs>

      {/* halo behind the building */}
      <ellipse cx="180" cy="220" rx="210" ry="230" fill="url(#halo)" opacity={0.35 + glow * 0.65} />

      {/* contact shadow so the building sits on the ground */}
      <ellipse cx="188" cy="372" rx="152" ry="20" fill="rgba(4,14,34,0.42)" />

      {/* top face */}
      <polygon points="66,96 116,64 316,64 266,96" fill="url(#face-top)" />
      {/* right face */}
      <polygon points="266,96 316,64 316,336 266,368" fill="url(#face-side)" />
      {/* front face */}
      <rect x="66" y="96" width="200" height="272" fill="url(#face-front)" />

      {/* hizam */}
      <rect x="66" y="168" width="200" height="34" fill="url(#band)" />
      <polygon points="266,168 316,136 316,170 266,202" fill="#b8912f" />
      {MOTIFS.map((x) => (
        <rect
          key={x}
          x={66 + x * 0.72}
          y={180}
          width="7"
          height="7"
          fill="rgba(72,52,12,0.5)"
          transform={`rotate(45 ${66 + x * 0.72 + 3.5} 183.5)`}
        />
      ))}

      {/* door */}
      <rect x="196" y="236" width="46" height="106" fill="#c9a33d" />
      <rect x="203" y="244" width="32" height="90" fill="#8f701f" />

      {/* white cloth at the hem */}
      <rect x="66" y="352" width="200" height="16" fill="#e9e3d4" />
      <polygon points="266,352 316,320 316,336 266,368" fill="#cfc9ba" />

      {/* light catching the front-left edge as the dua swells */}
      <rect x="66" y="96" width="200" height="272" fill="rgba(180,215,255,0.14)" opacity={glow} />
    </svg>
  );
};
