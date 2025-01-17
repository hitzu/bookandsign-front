import { axiosInstanceWithToken } from '../config/axiosConfig';

export const getUserProfile = async () => {
  try {
    const response = await axiosInstanceWithToken.get(`/user/profile`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
