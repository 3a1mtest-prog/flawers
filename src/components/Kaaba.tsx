const GOLD_MOTIFS = Array.from({ length: 11 }, (_, i) => 82 + i * 24);
const SCALLOPS = Array.from({ length: 14 }, (_, i) => 80 + i * 20);
const BRICK_ROWS = [0, 1];

/**
 * A stylised Kaaba drawn as flat vector art so the camera move stays crisp
 * at any scale: kiswah, gold hizam band, the white cloth skirt and a stone base.
 */
export const Kaaba: React.FC<{ glow: number }> = ({ glow }) => {
  return (
    <svg viewBox="0 0 460 540" width="100%" height="100%">
      <defs>
        <linearGradient id="kiswah-front" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1d1a1d" />
          <stop offset="45%" stopColor="#262227" />
          <stop offset="100%" stopColor="#141213" />
        </linearGradient>
        <linearGradient id="kiswah-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#100e10" />
          <stop offset="100%" stopColor="#080709" />
        </linearGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3c268" />
          <stop offset="38%" stopColor="#c8a03c" />
          <stop offset="62%" stopColor="#a87f26" />
          <stop offset="100%" stopColor="#d9b654" />
        </linearGradient>
        <linearGradient id="cloth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdfaf3" />
          <stop offset="100%" stopColor="#e2d9c6" />
        </linearGradient>
        <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a5c3c" />
          <stop offset="100%" stopColor="#6d452c" />
        </linearGradient>
      </defs>

      {/* halo behind the building, so the kiswah stays black as it swells */}
      <ellipse
        cx="240"
        cy="300"
        rx="290"
        ry="320"
        fill="rgba(255,226,158,0.42)"
        opacity={glow}
        style={{ filter: "blur(55px)" }}
      />

      {/* soft contact shadow on the ground */}
      <ellipse cx="235" cy="516" rx="215" ry="16" fill="rgba(84,62,34,0.28)" />

      {/* top face, seen at a shallow angle */}
      <polygon points="70,132 128,104 412,104 348,132" fill="#2b262b" />

      {/* right face */}
      <polygon points="348,132 412,104 412,452 348,478" fill="url(#kiswah-side)" />

      {/* front face */}
      <rect x="70" y="132" width="278" height="346" fill="url(#kiswah-front)" />

      {/* hizam — the embroidered gold band */}
      <rect x="70" y="214" width="278" height="46" fill="url(#gold)" />
      <polygon points="348,214 412,190 412,236 348,260" fill="url(#gold)" opacity="0.82" />
      <rect x="70" y="214" width="278" height="3" fill="#f0d894" opacity="0.75" />
      <rect x="70" y="257" width="278" height="3" fill="#7d5c18" opacity="0.7" />
      {GOLD_MOTIFS.map((x) => (
        <g key={x} opacity="0.55">
          <rect x={x} y="226" width="9" height="9" fill="#5d4310" transform={`rotate(45 ${x + 4.5} 230.5)`} />
          <rect x={x + 11} y="230" width="4" height="4" fill="#6b4d13" />
        </g>
      ))}

      {/* the door, offset to the right as on the real building */}
      <rect x="236" y="286" width="62" height="150" fill="url(#gold)" opacity="0.92" />
      <rect x="244" y="296" width="46" height="130" fill="none" stroke="#7d5c18" strokeWidth="2" opacity="0.6" />
      <rect x="252" y="308" width="30" height="106" fill="#8d6b1d" opacity="0.35" />

      {/* white cloth skirt with scalloped hem */}
      <rect x="70" y="452" width="278" height="26" fill="url(#cloth)" />
      <polygon points="348,452 412,426 412,452 348,478" fill="#efe7d6" />
      {SCALLOPS.map((x) => (
        <circle key={x} cx={x} cy="477" r="10" fill="url(#cloth)" />
      ))}

      {/* stone base */}
      <rect x="60" y="490" width="298" height="26" fill="url(#stone)" />
      <polygon points="358,490 418,466 418,492 358,516" fill="#5e3c26" />
      {BRICK_ROWS.map((row) =>
        Array.from({ length: 7 }, (_, i) => (
          <rect
            key={`${row}-${i}`}
            x={64 + i * 42 + (row % 2 ? 21 : 0)}
            y={492 + row * 12}
            width="38"
            height="10"
            fill="none"
            stroke="rgba(46,28,16,0.35)"
            strokeWidth="1.5"
          />
        )),
      )}

      {/* a thin rim of light on the leading edges only */}
      <rect x="70" y="132" width="278" height="346" fill="rgba(255,231,170,0.16)" opacity={glow} />
    </svg>
  );
};
