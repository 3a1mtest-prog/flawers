import { useMemo } from "react";
import { AdditiveBlending, CanvasTexture } from "three";
import { random } from "remotion";

const COUNT = 9000;

/**
 * A soft round sprite. Without it, `pointsMaterial` draws hard squares, which
 * read as confetti rather than as a crowd catching the light.
 */
const useDotTexture = () =>
  useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.55)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new CanvasTexture(canvas);
  }, []);

type Seeded = { radius: number; angle: number; speed: number; y: number };

/**
 * The mataf: thousands of points circling the Kaaba. Each one keeps a fixed
 * radius and gets its own speed, with the inner rings moving faster, so the
 * mass reads as a slow rotating current rather than a rigid disc.
 */
export const Crowd: React.FC<{ seconds: number; brightness: number }> = ({
  seconds,
  brightness,
}) => {
  const dot = useDotTexture();
  const seeded = useMemo<Seeded[]>(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        // sqrt keeps the density even instead of bunching at the centre
        const radius = 4.3 + Math.sqrt(random(`r-${i}`)) * 13.5;
        return {
          radius,
          angle: random(`a-${i}`) * Math.PI * 2,
          speed: (0.16 + random(`s-${i}`) * 0.06) * (7 / radius),
          y: 0.12 + random(`y-${i}`) * 0.5,
        };
      }),
    [],
  );

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    seeded.forEach((p, i) => {
      const a = p.angle + seconds * p.speed;
      arr[i * 3] = Math.cos(a) * p.radius;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = Math.sin(a) * p.radius;
    });
    return arr;
  }, [seeded, seconds]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        sizeAttenuation
        map={dot}
        color="#ffdda6"
        transparent
        opacity={0.5 * brightness}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const MOTE_COUNT = 700;

/** Dust hanging in the light above the mataf. */
export const Motes: React.FC<{ seconds: number; brightness: number }> = ({
  seconds,
  brightness,
}) => {
  const dot = useDotTexture();
  const positions = useMemo(() => {
    const arr = new Float32Array(MOTE_COUNT * 3);
    for (let i = 0; i < MOTE_COUNT; i++) {
      const radius = 4 + random(`mr-${i}`) * 18;
      const angle = random(`ma-${i}`) * Math.PI * 2 + seconds * 0.02;
      // drift upward and wrap, so the column never empties
      const rise = (random(`my-${i}`) * 14 + seconds * 0.35) % 14;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = 0.5 + rise;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return arr;
  }, [seconds]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={MOTE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        sizeAttenuation
        map={dot}
        color="#fff1cf"
        transparent
        opacity={0.42 * brightness}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
