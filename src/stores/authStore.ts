import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserInfo } from "../interfaces";

interface AuthState {
  userInfo: UserInfo | null;
  error: string | null;
  setUserInfo: (userInfo: UserInfo) => void;
  clearUserInfo: () => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userInfo: null,
      error: null,
      setUserInfo: (userInfo) => set({ userInfo, error: null }),
      clearUserInfo: () => {
        set({ userInfo: null, error: null });
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
      },
      setError: (error) => set({ error }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ userInfo: state.userInfo }),
    }
  )
);
