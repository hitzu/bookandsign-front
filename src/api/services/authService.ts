import { axiosInstanceWithoutToken } from '../config/axiosConfig';


export const login = async (payload : any) => {
  try {
    const authInfo = await axiosInstanceWithoutToken.post("/auth/login", payload);
    return authInfo;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (payload : any) => {
    try {
        const response = await axiosInstanceWithoutToken.post("/auth/signin", payload);
        return response;
    } catch (error) {
        console.error('Error in register:', error);
        throw error;
    }
};
