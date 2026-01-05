export interface Slot {
  id: number;
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
