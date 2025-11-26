export interface GetProductsResponse {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  price: number;
  discountPercentage: number | null;
  status: string;
  brandId: number;
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
  description: string;
  price: number;
  status: string;
  brandId: number;
}

export interface UpdateProductPayload extends CreateProductPayload {}
