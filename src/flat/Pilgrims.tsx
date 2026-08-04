import { AbsoluteFill, Img, random } from "remotion";
import { PILGRIM_SPRITES } from "../sprite-data";

const COUNT = 64;
const CX = 540;
const CY = 1392;
const RX = 540;
const RY = 150;
/** Height of a figure standing at the near edge of the ring, in frame pixels. */
const BASE_HEIGHT = 178;

type Figure = {
  i: number;
  x: number;
  y: number;
  scale: number;
  depth: number;
  bob: number;
  lean: number;
  sprite: string;
  flipped: boolean;
};

const layout = (seconds: number): Figure[] =>
  Array.from({ length: COUNT }, (_, i) => {
    const ring = i % 3;
    const rx = RX * (0.58 + ring * 0.21);
    const ry = RY * (0.58 + ring * 0.21);
    const speed = 0.19 - ring * 0.04;
    const angle = random(`p-${i}`) * Math.PI * 2 + seconds * speed;
    const depth = Math.sin(angle);

    // A stride cycle per figure, offset so the crowd never moves in step.
    const stride = seconds * (2.3 + random(`st-${i}`) * 0.8) + random(`ph-${i}`) * 6.3;

    return {
      i,
      x: CX + Math.cos(angle) * rx,
      y: CY + depth * ry,
      scale: 0.58 + (depth + 1) * 0.3,
      depth,
      bob: Math.abs(Math.sin(stride)) * 5,
      lean: Math.sin(stride) * 1.6,
      sprite: PILGRIM_SPRITES[Math.floor(random(`s-${i}`) * PILGRIM_SPRITES.length)],
      // mirroring doubles the apparent variety of the seven poses
      flipped: random(`f-${i}`) > 0.5,
    };
  });

/**
 * The ring of pilgrims, drawn from the generated character sheet. Split into
 * the far and near halves so the Kaaba sits between them and the circle reads
 * as going *around* it; figures nearer the camera are drawn larger and brighter.
 */
export const Pilgrims: React.FC<{ seconds: number; side: "back" | "front" }> = ({
  seconds,
  side,
}) => {
  const figures = layout(seconds).filter((f) =>
    side === "back" ? f.depth <= 0 : f.depth > 0,
  );

  return (
    <AbsoluteFill>
      {figures.map((f) => {
        const height = BASE_HEIGHT * f.scale;

        return (
          <div
            key={f.i}
            style={{
              position: "absolute",
              left: f.x,
              top: f.y - f.bob - height,
              height,
              translate: "-50% 0",
              rotate: `${f.lean}deg`,
              transformOrigin: "50% 100%",
              opacity: 0.62 + f.depth * 0.3,
            }}
          >
            {/* contact shadow, so the figure is planted rather than floating */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: -4,
                width: height * 0.42,
                height: height * 0.09,
                translate: "-50% 0",
                borderRadius: "50%",
                background: "rgba(4,14,36,0.34)",
                filter: "blur(3px)",
              }}
            />
            <Img
              src={f.sprite}
              style={{
                height: "100%",
                width: "auto",
                display: "block",
                scale: f.flipped ? "-1 1" : "1 1",
                // cool the sprites toward the night palette of the scene
                filter: `saturate(0.82) brightness(${(0.82 + f.depth * 0.15).toFixed(2)}) hue-rotate(-6deg)`,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
