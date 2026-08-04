import { Composition } from "remotion";
import { AkhelaaAd } from "./AkhelaaAd";
import { Tawaf } from "./Tawaf";
import { TawafCinematic } from "./TawafCinematic";
import { TawafReel } from "./TawafReel";
import { AD_SECONDS } from "./akhelaa/beats";
import { TOTAL_SECONDS } from "./script";

const FPS = 30;
const VERTICAL = { width: 1080, height: 1920 } as const;

export const MyComposition = () => {
  return (
    <>
      <Composition
        id="AkhelaaAd"
        component={AkhelaaAd}
        durationInFrames={AD_SECONDS * FPS}
        fps={FPS}
        {...VERTICAL}
      />
      <Composition
        id="TawafReel"
        component={TawafReel}
        durationInFrames={TOTAL_SECONDS * FPS}
        fps={FPS}
        {...VERTICAL}
        defaultProps={{ openingHold: 2 }}
      />
      <Composition
        id="TawafCinematic"
        component={TawafCinematic}
        durationInFrames={TOTAL_SECONDS * FPS}
        fps={FPS}
        {...VERTICAL}
        defaultProps={{ openingHold: 2 }}
      />
      <Composition
        id="TawafFlat"
        component={Tawaf}
        durationInFrames={TOTAL_SECONDS * FPS}
        fps={FPS}
        {...VERTICAL}
        defaultProps={{ openingHold: 2 }}
      />
    </>
  );
};
