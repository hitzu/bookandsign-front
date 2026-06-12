import {
  GetTermsResponse,
  CreateTermPayload,
  UpdateTermsPayload,
  TermScope,
} from "../../interfaces";

import {
  axiosInstanceWithToken,
  axiosInstanceWithoutToken,
} from "../config/axiosConfig";

export const getTerms = async ({
  termScope,
  query,
}: {
  termScope: string;
  query?: string;
}): Promise<GetTermsResponse[]> => {
  try {
    const queryParams = new URLSearchParams();

    queryParams.append("scope", termScope);

    if (query) {
      queryParams.append("q", query);
    }

    const url = `/terms?${queryParams.toString()}`;
    const response = await axiosInstanceWithoutToken.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching terms:", error);
    throw error;
  }
};

export const getPackageTerms = async (
  packageId: number
): Promise<GetTermsResponse[]> => {
  try {
    const response = await axiosInstanceWithoutToken.get(
      `/terms/packages/${packageId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching package terms:", error);
    throw error;
  }
};

export const getBrandTerms = async (
  brandId: number
): Promise<GetTermsResponse[]> => {
  try {
    const response = await axiosInstanceWithoutToken.get(
      `/terms/brands/${brandId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching brand terms:", error);
    throw error;
  }
};

export const deleteTermById = async (id: number): Promise<void> => {
  try {
    await axiosInstanceWithToken.delete(`/terms/${id}`);
  } catch (error) {
    console.error("Error deleting term by id:", error);
    throw error;
  }
};

export const createTerm = async (
  payload: CreateTermPayload
): Promise<GetTermsResponse> => {
  try {
    const response = await axiosInstanceWithToken.post<GetTermsResponse>(
      "/terms",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating package:", error);
    throw error;
  }
};

export const uploadTermsPackagesInBulk = async (
  idTerm: number,
  packages: number[]
): Promise<void> => {
  try {
    const payload = {
      packageIds: packages,
    };
    await axiosInstanceWithToken.post(
      `/terms/${idTerm}/packages/bulk`,
      payload
    );
  } catch (error) {
    console.error("Error uploading products:", error);
    throw error;
  }
};

export const uploadTermsBrandsInBulk = async (
  idTerm: number,
  brands: number[]
): Promise<void> => {
  try {
    const payload = {
      brandIds: brands,
    };
    await axiosInstanceWithToken.post(`/terms/${idTerm}/brands/bulk`, payload);
  } catch (error) {
    console.error("Error uploading brands:", error);
    throw error;
  }
};

export const addTermToBrand = async (payload: {
  brandId: number;
  termId: number;
}): Promise<void> => {
  try {
    await axiosInstanceWithToken.post("/terms/brands", payload);
  } catch (error) {
    console.error("Error attaching term to brand:", error);
    throw error;
  }
};

export const removeTermFromBrand = async (payload: {
  brandId: number;
  termId: number;
}): Promise<void> => {
  try {
    await axiosInstanceWithToken.delete("/terms/brands", { data: payload });
  } catch (error) {
    console.error("Error detaching term from brand:", error);
    throw error;
  }
};

export const updateTermsById = async (
  id: number,
  payload: UpdateTermsPayload
): Promise<void> => {
  try {
    await axiosInstanceWithToken.patch(`/terms/${id}`, payload);
  } catch (error) {
    console.error("Error updating package by id:", error);
    throw error;
  }
};

export const getTermById = async (id: number): Promise<GetTermsResponse> => {
  try {
    const response = await axiosInstanceWithToken.get<GetTermsResponse>(
      `/terms/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching package by id:", error);
    throw error;
  }
};

export const getPublicTerms = async (params: {
  targetId?: number;
  scope: TermScope;
}): Promise<GetTermsResponse[]> => {
  try {
    const { targetId, scope } = params;
    if (scope === "package" && targetId) {
      const queryParams = new URLSearchParams();
      queryParams.append("packageId", targetId.toString());
      const response = await axiosInstanceWithoutToken.get<GetTermsResponse[]>(
        `/terms/public/${scope}/?${queryParams.toString()}`
      );
      return response.data;
    }
    const response = await axiosInstanceWithToken.get<GetTermsResponse[]>(
      `/terms/public/${scope}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching public terms:", error);
    return [];
  }
};

export const getPublicBrandTerms = async (
  brandId: number
): Promise<GetTermsResponse[]> => {
  try {
    const response = await axiosInstanceWithoutToken.get<GetTermsResponse[]>(
      "/terms/public/brand",
      { params: { brandId } }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching public brand terms:", error);
    return [];
  }
};
