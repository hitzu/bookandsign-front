import { UserInfo } from "../../interfaces";

import {
  axiosInstanceWithoutToken,
  axiosInstanceWithToken,
} from "../config/axiosConfig";

export const getUsers = async (role?: string): Promise<UserInfo[]> => {
  try {
    const queryParams = new URLSearchParams();

    if (role) queryParams.append("role", role);

    const qs = queryParams.toString();
    const url = qs ? `/users?${qs}` : `/users`;
    const response = await axiosInstanceWithToken.get(url);
    const data = (response.data ?? []) as UserInfo[];
    return data.map((u) => ({
      ...u,
      name:
        (u as any)?.name ??
        [u.firstName, u.lastName].filter(Boolean).join(" ").trim(),
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
