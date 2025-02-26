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

export const getProspectById = async (id: number): Promise<GetProspectsResponse> => {
  try {
    const response = await axiosInstanceWithToken.get(`/prospects/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching this prospect:', error);
    throw error;
  }
};

export const updateProspectById = async (id: number, payload: any) => {
  try {
    const response = await axiosInstanceWithToken.patch(`/prospects/${id}`, payload);
    return response;
  } catch (error) {
    console.error('Error updating prospect:', error);
    throw error;
  }
};
