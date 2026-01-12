import { Package } from "./packages";
import { Payment } from "./payments";
import { Promotion } from "./promotions";
import { Slot } from "./slots";

export interface Contract {
  id: number;
  createdAt: string;
  status: string;
  clientName: string;
  clientPhone: string | null;
  clientEmail: string | null;
  subtotal: number;
  discountTotal: number;
  total: number;
  sku: string;
  totalAmount: number;
  token: string;
}

export interface ContractPackages {
  id: number;
  contractId: number;
  packageId: number;
  promotionId: number | null;
  quantity: number;
  basePriceSnapshot: number;
  source: string;
  package: Package;
  promotion: Promotion | null;
}

export interface ContractSlot {
  id: number;
  purpose: string;
  slotId: number;
  contractId: number;
  slot: Slot;
}

export interface GetContractByIdResponse {
  contract: Contract;
  slots?: Slot[];
  packages: ContractPackages[];
  payments: Payment[];
  paidAmount: number;
  contractSlots: ContractSlot[];
}

export interface GenerateContractItem {
  packageId: number;
  quantity: number;
  source?: string;
}

export interface GenerateContractPayload {
  userId: number;
  slotId: number;
  sku: string;
  clientName: string;
  clientPhone: string | null;
  clientEmail: string | null;
  subtotal: number;
  discountTotal: number;
  total: number;
  packages: GenerateContractItem[];
}
