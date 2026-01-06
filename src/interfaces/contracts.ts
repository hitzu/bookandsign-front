import { Package } from "./packages";
import { Slot } from "./slots";

export interface Contract {
  id: number;
  status: string;
  totalAmount: number;
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
  payments: any[];
  paidAmount: number;
}

export interface GenerateContractItem {
  packageId: number;
  quantity: number;
  source: string;
}

export interface GenerateContractPayload {
  slotId: number;
  packages: GenerateContractItem[];
}
