export interface Slot {
  id: number;
  eventDate: string;
  status: string;
  leadName: string;
  leadEmail: string | null;
  leadPhone: string | null;
  contractId: number | null;
}

export interface GetSlotResponse {
  period: string;
  available: boolean;
  slot: Slot | null;
}

export type SlotAvailabilityStatus = "available" | "reserved";
export type CalendarDaySlots = {
  morning: SlotAvailabilityStatus;
  afternoon: SlotAvailabilityStatus;
};
export interface CalendarSlotsByMonthResponse {
  date: string;
  slots: CalendarDaySlots;
}
