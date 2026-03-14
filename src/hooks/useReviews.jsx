import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axios';

const fetchReviews = async (tourId) => {
  const res = await axiosInstance.get(`/reviews?referenceTour=${tourId}`);
  return res.data.data.doc;
};

const useReviews = (tourId) => {
  return useQuery({
    queryKey: ['reviews', tourId],
    queryFn: () => fetchReviews(tourId),
    enabled: !!tourId,
  });
};

export default useReviews;