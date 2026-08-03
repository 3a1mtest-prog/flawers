const PILLARS = 44;
const RADIUS = 33;
const HEIGHT = 9.5;

/**
 * The arcade ringing the courtyard. It is mostly swallowed by fog, which is the
 * point: it gives the Kaaba something to be small against, so the space reads
 * as a courtyard rather than an empty plane.
 */
export const Colonnade: React.FC<{ glow: number }> = ({ glow }) => {
  const pillars = Array.from({ length: PILLARS }, (_, i) => {
    const angle = (i / PILLARS) * Math.PI * 2;
    return { angle, x: Math.cos(angle) * RADIUS, z: Math.sin(angle) * RADIUS };
  });

  return (
    <group>
      {pillars.map((p) => (
        <group key={p.angle} position={[p.x, 0, p.z]} rotation={[0, -p.angle, 0]}>
          <mesh position={[0, HEIGHT / 2, 0]}>
            <boxGeometry args={[1.1, HEIGHT, 1.1]} />
            <meshStandardMaterial color="#6f6553" roughness={0.9} />
          </mesh>
          {/* lantern hung between the columns */}
          <mesh position={[0, HEIGHT * 0.72, 1.6]}>
            <sphereGeometry args={[0.22, 10, 10]} />
            <meshBasicMaterial color="#ffd9a1" transparent opacity={0.55 + glow * 0.4} />
          </mesh>
        </group>
      ))}

      {/* the roof band tying the columns together */}
      <mesh position={[0, HEIGHT + 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RADIUS, 0.85, 8, 96]} />
        <meshStandardMaterial color="#5d5445" roughness={0.95} />
      </mesh>
    </group>
  );
};
