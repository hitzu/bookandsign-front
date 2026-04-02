export type DedicationPhrase = {
  id: string;
  text: string;
};

export type DedicationEventType = "xv" | "boda";

const XV_PHRASES: DedicationPhrase[] = [
  { id: "xv-1", text: "Brilla siempre como esta noche" },
  { id: "xv-2", text: "15 primaveras y un millon de suenos" },
  { id: "xv-3", text: "Esta noche es solo el comienzo" },
  { id: "xv-4", text: "Que la vida te llene de momentos asi" },
  { id: "xv-5", text: "De tus amigos que te quieren un monton" },
];

const BODA_PHRASES: DedicationPhrase[] = [
  { id: "boda-1", text: "Felicidades en este nuevo camino juntos" },
  { id: "boda-2", text: "El amor que se ve, se siente y se celebra" },
  { id: "boda-3", text: "Que este sea el primero de mil bailes" },
  { id: "boda-4", text: "Los queremos y los celebramos siempre" },
  { id: "boda-5", text: "Por el amor que inspiran a todos" },
];

const PHRASE_CATALOG: Record<DedicationEventType, DedicationPhrase[]> = {
  xv: XV_PHRASES,
  boda: BODA_PHRASES,
};

export function getDedicationPhrases(
  eventType: DedicationEventType,
): DedicationPhrase[] {
  return PHRASE_CATALOG[eventType] ?? XV_PHRASES;
}
