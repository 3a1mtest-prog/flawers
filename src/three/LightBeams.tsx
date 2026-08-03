import { AdditiveBlending, DoubleSide } from "three";

const BEAMS = [
  { angle: 0.3, tilt: 0.22, radius: 15 },
  { angle: 1.9, tilt: 0.3, radius: 17 },
  { angle: 3.4, tilt: 0.18, radius: 14 },
  { angle: 4.8, tilt: 0.26, radius: 16 },
];

/**
 * Shafts of light leaning in over the courtyard. Open cones with additive
 * blending read as volumetric without needing a post-processing pass.
 */
export const LightBeams: React.FC<{ strength: number; seconds: number }> = ({
  strength,
  seconds,
}) => {
  return (
    <group rotation={[0, seconds * 0.012, 0]}>
      {BEAMS.map((b) => (
        <mesh
          key={b.angle}
          position={[Math.cos(b.angle) * b.radius, 11, Math.sin(b.angle) * b.radius]}
          rotation={[Math.PI + b.tilt, 0, Math.sin(b.angle) * b.tilt]}
        >
          <coneGeometry args={[3.4, 22, 24, 1, true]} />
          <meshBasicMaterial
            color="#ffdfa6"
            transparent
            opacity={0.05 + strength * 0.09}
            blending={AdditiveBlending}
            side={DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* a wider, softer column straight down onto the Kaaba */}
      <mesh position={[0, 13, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[6.5, 26, 28, 1, true]} />
        <meshBasicMaterial
          color="#ffe9bd"
          transparent
          opacity={0.04 + strength * 0.11}
          blending={AdditiveBlending}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
