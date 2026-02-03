import { Provider } from "./provider";

export interface Product {
  id: number;
  name: string;
  brandId: number;
  promotionalType: string;
  createdAt: string;
  updatedAt: string;
}
export interface GetProductsResponse {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  price: number;
  discountPercentage: number | null;
  status: string;
  brandId: number;
  quantity: number;
  isPromotional: boolean;
  promotionalText: string | null;
  brand: {
    id: number;
    key: string;
    name: string;
    theme: {
      logo: string;
      primaryColor: string;
      secondaryColor: string;
    };
    logoUrl: string | null;
  };
}

export interface CreateProductPayload {
  name: string;
  brandId: number;
}

export interface UpdateProductPayload extends CreateProductPayload { }

export interface CreatePaymentObligationPayload {
  productId?: number;
  providerId: number;
  amount: number;
}

export interface PaymentObligation {
  id: number;
  productId: number;
  providerId: number;
  amount: number;
  product: Product;
  provider: Provider;
}

export type CreatePaymentObligationBulkItem =
  Omit<CreatePaymentObligationPayload, "productId">;