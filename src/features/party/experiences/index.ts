import { fotoBoothExperience } from "./fotobooth";
import { ExperienceConfig } from "./types";

/**
 * Factory: retorna la experiencia visual correcta según el tipo de evento.
 * Agregar nuevos casos aquí cuando el backend soporte eventType.
 */
export const getExperience = (eventType?: string): ExperienceConfig => {
  switch (eventType) {
    // case 'boda':    return bodaExperience
    // case 'corp':    return corporativoExperience
    default:
      return fotoBoothExperience;
  }
};

export type { ExperienceConfig } from "./types";
