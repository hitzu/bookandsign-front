import { GetEventTypesResponse } from '../../interfaces';
import { axiosInstanceWithToken } from '../config/axiosConfig';

export const getEventTypes = async (): Promise<GetEventTypesResponse[]> => {
  try {
    const response = await axiosInstanceWithToken.get(`/event-type`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user prospects:', error);
    throw error;
  }
};