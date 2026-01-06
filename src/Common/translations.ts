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
