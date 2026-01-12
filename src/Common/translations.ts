/**
 * Traduce el status de un producto del inglés al español
 * @param status - El status en inglés (draft, active, inactive)
 * @returns El status traducido al español
 */
export const translateProductStatus = (status: string): string => {
  const translations: Record<string, string> = {
    draft: "Borrador",
    active: "Activo",
    inactive: "Inactivo",
  };
  return translations[status] || status;
};

export const translatePackageStatus = (status: string): string => {
  const translations: Record<string, string> = {
    draft: "Borrador",
    active: "Activo",
    inactive: "Inactivo",
  };
  return translations[status] || status;
};

export const translateSlotStatus = (status: string): string => {
  const translations: Record<string, string> = {
    available: "Disponible",
    held: "Apartado",
    booked: "Ocupado",
  };
  return translations[status] || status;
};

export const translateContractSlotPurpose = (purpose: string): string => {
  const translations: Record<string, string> = {
    [CONTRACT_SLOT_PURPOSE.EVENT]: "Evento Principal",
    [CONTRACT_SLOT_PURPOSE.TRIAL_MAKEUP]: "Prueba de maquillaje",
    [CONTRACT_SLOT_PURPOSE.TRIAL_HAIR]: "Prueba de pelo",
    [CONTRACT_SLOT_PURPOSE.TRIAL_NAIL]: "Prueba de uñas",
    [CONTRACT_SLOT_PURPOSE.OTHER]: "Otro",
  };
  return translations[purpose] || purpose;
};

export enum CONTRACT_SLOT_PURPOSE {
  EVENT = "event",
  TRIAL_MAKEUP = "trial_makeup",
  TRIAL_HAIR = "trial_hair",
  TRIAL_NAIL = "trial_nail",
  OTHER = "other",
}
