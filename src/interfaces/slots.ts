export interface Slot {
  id: number;
  eventDate: string;
  status: string;
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

export interface ContractSlotInfo {
  id: number;
  status: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  sku: string;
  brandId: number | null;
}

export type CalendarDayContracts = {
  morning: ContractSlotInfo | null;
  afternoon: ContractSlotInfo | null;
};

export interface CalendarSlotsByMonthResponse {
  date: string;
  slots: CalendarDaySlots;
  contracts?: CalendarDayContracts;
}

export interface CalendarSlotsByMonthPayload {
  risk: boolean;
  days: CalendarSlotsByMonthResponse[];
}
