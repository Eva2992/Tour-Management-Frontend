import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axios';

const fetchTours = async (searchName = '', sort = '') => {
  const params = new URLSearchParams();
  if (searchName) params.append('name', searchName);
  if (sort) params.append('sort', sort);

  const query = params.toString();
  const url = query ? `/tours?${query}` : '/tours';
  const res = await axiosInstance.get(url);
  return res.data.data.doc;
};

const useTour = (searchName = '', sort = '') => {
  return useQuery({
    queryKey: ['tours', searchName, sort],
    queryFn: () => fetchTours(searchName, sort),
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    staleTime: 1000 * 60 * 5,       // data stays fresh for 5 minutes
    gcTime: 1000 * 60 * 10,          // cache kept for 10 minutes
    refetchOnWindowFocus: false,
  });
};

export default useTour;