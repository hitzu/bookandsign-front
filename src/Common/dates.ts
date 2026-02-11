/**
 * Parsea un string YYYY-MM-DD como fecha local (sin conversión UTC).
 * Evita el bug donde "2026-05-30" se interpreta como medianoche UTC
 * y en zonas horarias negativas muestra el día anterior.
 */
export const parseLocalDate = (dateString: string): Date => {
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return new Date(dateString); // fallback al comportamiento por defecto
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
};

export const formatLongSpanishDate = (d: Date) =>
  new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(d)
    .replace(",", "");
