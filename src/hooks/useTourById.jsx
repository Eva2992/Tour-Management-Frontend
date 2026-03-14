import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axios';

const fetchTourById = async (id) => {
  const res = await axiosInstance.get(`/tours/${id}`); // {{URL}}/api/v1/tours/:id
  return res.data.data.doc;
};

const useTourById = (id) => {
  return useQuery({
    queryKey: ['tour', id],
    queryFn: () => fetchTourById(id),
    enabled: !!id,
  });
};

export default useTourById;