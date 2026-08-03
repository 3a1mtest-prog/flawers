import { useMemo } from "react";
import { kiswahTexture } from "./textures";

const GOLD = "#c9a13f";

/**
 * The building. The kiswah, its gold hizam and the door are all baked into the
 * face textures, so the only geometry is the cube itself, the white cloth at
 * the base and the plinth.
 */
export const Kaaba3D: React.FC<{ glow: number }> = ({ glow }) => {
  const w = 4.6;
  const h = 5.2;

  // The door sits on one face only; the other three carry plain cloth.
  const plain = useMemo(() => kiswahTexture(false), []);
  const withDoor = useMemo(() => kiswahTexture(true), []);
  const emissive = 0.05 + glow * 0.22;

  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, w]} />
        {/* +X face carries the door; order is +X -X +Y -Y +Z -Z */}
        <meshStandardMaterial
          attach="material-0"
          map={withDoor}
          roughness={0.88}
          emissive={GOLD}
          emissiveIntensity={emissive}
        />
        <meshStandardMaterial attach="material-1" map={plain} roughness={0.88} />
        <meshStandardMaterial attach="material-2" color="#0d0d0f" roughness={0.95} />
        <meshStandardMaterial attach="material-3" color="#0a0a0c" roughness={0.95} />
        <meshStandardMaterial
          attach="material-4"
          map={plain}
          roughness={0.88}
          emissive={GOLD}
          emissiveIntensity={emissive * 0.6}
        />
        <meshStandardMaterial attach="material-5" map={plain} roughness={0.88} />
      </mesh>

      {/* white cloth skirt */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[w + 0.12, 0.6, w + 0.12]} />
        <meshStandardMaterial color="#ddd6c6" roughness={0.85} />
      </mesh>

      {/* marble plinth */}
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[w + 1.1, 0.14, w + 1.1]} />
        <meshStandardMaterial color="#9c8f76" roughness={0.75} metalness={0.1} />
      </mesh>
    </group>
  );
};
