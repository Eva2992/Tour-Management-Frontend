import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axios';

const fetchTours = async (searchName = '') => {
  const url = searchName ? `/tours?name=${searchName}` : '/tours';
  const res = await axiosInstance.get(url);
  return res.data.data.doc;
};

const useTour = (searchName = '') => {  // ✅ renamed to useTour
  return useQuery({
    queryKey: ['tours', searchName],
    queryFn: () => fetchTours(searchName),
  });
};

export default useTour;