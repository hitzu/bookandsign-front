import { Provider } from '../../interfaces';
import { axiosInstanceWithToken } from '../config/axiosConfig';

export const getProviders = async (): Promise<Provider[]> => {
  try {
    const response = await axiosInstanceWithToken.get(`/providers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching providers:', error);
    throw error;
  }
}
