import { Package } from "./packages";
import { Payment } from "./payments";
import { Slot } from "./slots";

export interface Contract {
  id: number;
  status: string;
  totalAmount: number;
  token: string;
}

export interface ContractItem {
  id: number;
  contractId: number;
  packageId: number;
  quantity: number;
  source: string;
  package: Package;
}

export interface GetContractByIdResponse {
  contract: Contract;
  slots: Slot[];
  items: ContractItem[];
  payments: Payment[];
  paidAmount: number;
}

export interface GenerateContractItem {
  packageId: number;
  quantity: number;
  source: string;
}

export interface GenerateContractPayload {
  slotId: number;
  sku: string;
  packages: GenerateContractItem[];
}
