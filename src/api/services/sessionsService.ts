import { SessionCacheClearResponse } from "../../interfaces";
import { axiosInstanceWithToken } from "../config/axiosConfig";

export const clearSessionsCache =
  async (): Promise<SessionCacheClearResponse> => {
    try {
      const response = await axiosInstanceWithToken.post<SessionCacheClearResponse>(
        "/sessions/cache/clear"
      );
      return response.data;
    } catch (error) {
      console.error("Error clearing sessions cache:", error);
      throw error;
    }
  };
