import { Extra } from "./extras";
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

export interface ContractExtra {
  id: number;
  contractId: number;
  extraId: number;
  quantity: number;
  nameSnapshot: string;
  basePriceSnapshot: number;
  extra: Extra;
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
  extras: ContractExtra[];
  payments: Payment[];
  paidAmount: number;
  contractSlots: ContractSlot[];
}



export interface ContractCompleteResponse {
  contract: Contract;
  slots?: Slot[];
  packages: ContractPackages[];
  extras: ContractExtra[];
  payments: Payment[];
  paidAmount: number;
  contractSlots: ContractSlot[];
}


export interface GenerateContractItem {
  packageId: number;
  quantity: number;
  source?: string;
}

export interface GenerateContractExtra {
  extraId: number;
  quantity: number;
  promotionId?: number;
  basePriceSnapshot: number;
}

export interface GenerateContractPayload {
  userId: number;
  slotId: number;
  brandId?: number;
  sku: string;
  clientName: string;
  clientPhone: string | null;
  clientEmail: string | null;
  subtotal: number;
  discountTotal: number;
  total: number;
  packages: GenerateContractItem[];
  extras?: GenerateContractExtra[];
}
