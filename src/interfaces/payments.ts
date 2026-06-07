export type PaymentMethod = "cash" | "transfer" | "card";

export interface Payment {
  id: number;
  contractId: number;
  amount: number;
  method: PaymentMethod;
  status?: string;
  receivedAt: string;
  note: string | null;
  reference: string | null;
}

export interface CreatePaymentPayload {
  contractId: number;
  amount: number;
  method: PaymentMethod;
  receivedAt: string;
  note?: string;
  reference?: string;
}
