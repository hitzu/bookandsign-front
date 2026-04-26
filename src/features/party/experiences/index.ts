import { fotoBoothExperience } from "./fotobooth";
import { ExperienceConfig } from "./types";

export const getExperience = (themeKey?: string): ExperienceConfig => {
  switch (themeKey) {
    case "xv_pretty":
      return fotoBoothExperience;
    default:
      return fotoBoothExperience;
  }
};

export type { ExperienceConfig } from "./types";
