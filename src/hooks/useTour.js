import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axios';

const fetchTours = async () => {
  try {
    const res = await axiosInstance.get('/tours');
    console.log('API Response:', res.data);
    return res.data.data.doc;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

const useTours = () => {
  return useQuery({
    queryKey: ['tours'],
    queryFn: fetchTours,
  });
};

export default useTours;