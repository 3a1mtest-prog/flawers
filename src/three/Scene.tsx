import { useThree } from "@react-three/fiber";
import { AdditiveBlending } from "three";
import { Colonnade } from "./Colonnade";
import { Crowd, Motes } from "./Crowd";
import { Kaaba3D } from "./Kaaba3D";
import { LightBeams } from "./LightBeams";

/**
 * Drives the camera from the frame rather than from a controls helper: it
 * swings a third of a turn around the courtyard while dropping and closing in,
 * ending eye-level with the Kaaba.
 */
const CameraRig: React.FC<{ t: number }> = ({ t }) => {
  const camera = useThree((s) => s.camera);

  // ease-out so the move is quickest at the top and settles at the end
  const eased = 1 - Math.pow(1 - t, 2.2);
  const angle = -0.55 + eased * 0.62;
  const radius = 30 - eased * 16.5;
  const height = 11.5 - eased * 7.4;

  camera.position.set(
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius,
  );
  camera.lookAt(0, 2.7 + eased * 0.2, 0);
  camera.updateProjectionMatrix();

  return null;
};

export const Scene: React.FC<{ seconds: number; t: number; glow: number }> = ({
  seconds,
  t,
  glow,
}) => {
  return (
    <>
      <CameraRig t={t} />
      <fogExp2 attach="fog" args={["#0b0f1a", 0.021]} />

      <ambientLight intensity={0.4} color="#c8d2ee" />
      <hemisphereLight intensity={0.35} color="#ffe2b4" groundColor="#2a2418" />
      <directionalLight position={[9, 16, 7]} intensity={1.5} color="#ffd9a0" />
      <directionalLight position={[-11, 7, -8]} intensity={0.55} color="#8fa6ff" />
      <pointLight
        position={[0, 3.2, 0]}
        intensity={22 + glow * 45}
        distance={26}
        decay={2}
        color="#ffcf86"
      />

      {/* courtyard floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[70, 72]} />
        <meshStandardMaterial color="#6b6558" roughness={0.42} metalness={0.28} />
      </mesh>

      {/* pool of warm light on the marble, right under the building */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[17, 64]} />
        <meshBasicMaterial
          color="#ffca7d"
          transparent
          opacity={0.1 + glow * 0.16}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <Colonnade glow={glow} />
      <Kaaba3D glow={glow} />
      <Crowd seconds={seconds} brightness={0.85 + glow * 0.5} />
      <Motes seconds={seconds} brightness={0.5 + glow * 0.9} />
      <LightBeams strength={glow} seconds={seconds} />
    </>
  );
};
