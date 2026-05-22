import FotoBoothSplash from "./Splash";
import FotoBoothCarousel from "./Carousel";
import FotoBoothOverview from "./Overview";
import { ExperienceConfig } from "../types";

export const fotoBoothExperience: ExperienceConfig = {
  Splash: FotoBoothSplash,
  Carousel: FotoBoothCarousel,
  Overview: FotoBoothOverview,
  theme: {
    pageBackground: "#fff5f7",
    primaryButtonBg: "linear-gradient(135deg, #9d174d 0%, #6b21a8 100%)",
    primaryButtonText: "#ffffff",
    secondaryButtonBg: "#f9a8d4",
    secondaryButtonText: "#9d174d",
    accentColor: "#be185d",
    textColor: "#1a0a12",
    mutedTextColor: "rgba(190, 24, 93, 0.45)",
    dividerColor: "#fbcfe8",
    surfaceBackground:
      "linear-gradient(160deg, rgba(252, 231, 243, 0.94) 0%, rgba(245, 230, 255, 0.94) 100%)",
    surfaceBorderColor: "rgba(236, 72, 153, 0.12)",
    surfaceShadow: "0 18px 44px rgba(190, 24, 93, 0.12)",
    accentGlow: "rgba(190, 24, 93, 0.16)",
  },
  // Must match `.page` background in fotobooth-overview.module.css
  pageBackground: "#fff5f7",
};
