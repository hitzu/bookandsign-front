import { GetContactMethodsResponse } from '../../interfaces';
import { axiosInstanceWithToken } from '../config/axiosConfig';

export const getContactMethods = async (): Promise<GetContactMethodsResponse[]> => {
  try {
    const response = await axiosInstanceWithToken.get(`/contact-method`);
    return response.data;
  } catch (error) {
    console.error('Error fetching contact methods:', error);
    throw error;
  }
};