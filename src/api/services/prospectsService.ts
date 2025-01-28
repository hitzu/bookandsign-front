import { GetProspectsResponse } from '../../interfaces';
import { axiosInstanceWithToken } from '../config/axiosConfig';

export const getProspectsByUser = async (): Promise<GetProspectsResponse[]> => {
  try {
    const response = await axiosInstanceWithToken.get(`/prospects`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user prospects:', error);
    throw error;
  }
};
