import axios from 'axios';

const baseURLs = {
  local: 'http://localhost:3000',
  dev: 'https://dev.api.example.com',
  prod: 'https://api.example.com',
};

const environment = process.env.NODE_ENV || 'local';
const baseURL = baseURLs[environment];

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async get(endpoint) {
    try {
      const response = await this.api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      const response = await this.api.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }

  // Agrega más métodos según sea necesario
}

export default new ApiService();