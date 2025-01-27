import { axiosInstanceWithToken } from '../config/axiosConfig';

export const getProspectsByUser = async () => {
  try {
    const response = await axiosInstanceWithToken.get(`/prospects`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
