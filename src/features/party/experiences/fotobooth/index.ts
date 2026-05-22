import FotoBoothSplash from "./Splash";
import FotoBoothCarousel from "./Carousel";
import FotoBoothOverview from "./Overview";
import { ExperienceConfig } from "../types";

export const fotoBoothExperience: ExperienceConfig = {
  Splash: FotoBoothSplash,
  Carousel: FotoBoothCarousel,
  Overview: FotoBoothOverview,
  // Must match `.page` background in fotobooth-overview.module.css
  pageBackground: "#fff5f7",
};
