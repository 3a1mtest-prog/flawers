import { Composition } from "remotion";
import { Tawaf } from "./Tawaf";
import { TOTAL_SECONDS } from "./script";

const FPS = 30;

export const MyComposition = () => {
  return (
    <Composition
      id="Tawaf"
      component={Tawaf}
      durationInFrames={TOTAL_SECONDS * FPS}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{ openingHold: 2 }}
    />
  );
};
