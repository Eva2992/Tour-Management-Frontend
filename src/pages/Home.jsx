import useTour from '../hooks/useTour';
import TourCard from '../components/TourCard';

const HomePage = () => {
  const { data: tours, isLoading, isError, error } = useTour();

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-xl text-gray-500">Loading tours...</p>
    </div>
  );

  if (isError) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-xl text-red-500">Error: {error.message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        All Tours
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        {tours.map((tour) => (
          <TourCard key={tour._id} tour={tour} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;