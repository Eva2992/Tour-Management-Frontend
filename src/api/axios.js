import axios from 'axios';
import { apiBaseUrl } from './config';

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true, // for cookies as JWT
});

export default axiosInstance;