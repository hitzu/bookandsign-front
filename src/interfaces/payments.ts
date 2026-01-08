export interface Payment {
  id: number;
  contractId: number;
  amount: number;
  method: string;
  status: string;
  receivedAt: string;
  note: string | null;
  reference: string | null;
}

export interface CreatePaymentPayload {
  contractId: number;
  amount: number;
  method: string;
  note: string;
  receivedAt: string;
}
