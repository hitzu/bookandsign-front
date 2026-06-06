import { GetBrandsResponse } from "./brands";

export type ExtraStatus = "active" | "inactive";

export interface Extra {
  id: number;
  brandId: number;
  name: string;
  description: string | null;
  price: number;
  status: ExtraStatus;
  brand: GetBrandsResponse;
}

export interface CreateExtraPayload {
  brandId: number;
  name: string;
  description?: string | null;
  price: number;
  status?: ExtraStatus;
}

export interface UpdateExtraPayload extends CreateExtraPayload {}
