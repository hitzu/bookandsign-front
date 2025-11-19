// src/hooks/useAuthToken.js
import { useState, useEffect } from "react";

export const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const saveToken = (newToken: string) => {
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
  };

  const clearToken = () => {
    localStorage.removeItem("authToken");
    setToken(null);
  };

  return { token, saveToken, clearToken };
};
