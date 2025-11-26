import {
  GetProductsResponse,
  CreateProductPayload,
  UpdateProductPayload,
} from "../../interfaces/products";
import { axiosInstanceWithToken } from "../config/axiosConfig";

export const getProducts = async ({
  brandId,
  term,
}: {
  brandId?: number;
  term?: string;
}): Promise<GetProductsResponse[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (brandId) {
      queryParams.append("brandId", brandId.toString());
    }
    if (term) {
      queryParams.append("term", term);
    }
    const url =
      "/products" + (brandId || term ? `?${queryParams.toString()}` : "");
    const response = await axiosInstanceWithToken.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching user prospects:", error);
    throw error;
  }
};

export const getProductsStatuses = async (): Promise<string[]> => {
  try {
    const response = await axiosInstanceWithToken.get<string[]>(
      "/products/statuses"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products statuses:", error);
    throw error;
  }
};

export const createProduct = async (
  payload: CreateProductPayload
): Promise<void> => {
  try {
    const response = await axiosInstanceWithToken.post("/products", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const getProductById = async (
  id: number
): Promise<GetProductsResponse> => {
  try {
    const response = await axiosInstanceWithToken.get<GetProductsResponse>(
      `/products/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product by id:", error);
    throw error;
  }
};

export const updateProductById = async (
  id: number,
  payload: UpdateProductPayload
): Promise<void> => {
  try {
    const response = await axiosInstanceWithToken.patch(
      `/products/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product by id:", error);
    throw error;
  }
};

export const deleteProductById = async (id: number): Promise<void> => {
  try {
    const response = await axiosInstanceWithToken.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product by id:", error);
    throw error;
  }
};
