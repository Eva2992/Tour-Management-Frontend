import { useState } from 'react';
import useTour from '../hooks/useTour';
import TourCard from '../components/TourCard';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Bestsellers from '../components/Bestsellers';
import Footer from '../components/Footer';

const HomePage = () => {
  const [sortBy, setSortBy] = useState('');
  const [displayedTours, setDisplayedTours] = useState(null);

  const { data: allTours, isLoading, isError, error } = useTour('', sortBy);

  const errorStatus = error?.response?.status;
  const errorText =
    errorStatus >= 500
      ? `Server error (${errorStatus}). Please check backend logs.`
      : errorStatus
        ? `Request failed (${errorStatus}). Please try again.`
        : `Network error: ${error?.message}. Make sure your backend server is running.`;

  // null = show all, otherwise show filtered
  const tours = displayedTours ?? allTours;

  const handleSelect = (tour) => setDisplayedTours([tour]);
  const handleClear = () => setDisplayedTours(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <Hero
        allTours={allTours}
        onSelect={handleSelect}
        onClear={handleClear}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">

            {/* Section Title + Sort Dropdowns */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-4xl font-bold text-emerald-600">
                Explore Our Featured Tours
              </h2>

              {/* Sort Dropdowns */}
              <div className="flex gap-3 flex-wrap">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-5 py-2.5 rounded-full bg-white border-2 border-emerald-400 hover:border-emerald-500 focus:outline-none cursor-pointer font-semibold text-emerald-700 transition-all duration-200 shadow-md text-sm"
                >
                  <option value="">💰 Sort by Price</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-5 py-2.5 rounded-full bg-white border-2 border-cyan-400 hover:border-cyan-500 focus:outline-none cursor-pointer font-semibold text-cyan-700 transition-all duration-200 shadow-md text-sm"
                >
                  <option value="">⭐ Sort by Rating</option>
                  <option value="-ratingsAverage">Rating: High to Low</option>
                  <option value="ratingsAverage">Rating: Low to High</option>
                </select>
              </div>
            </div>

            {/* Results count */}
            {!isLoading && tours && (
              <div className="mb-6 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-sm px-4 py-1.5 rounded-full">
                  🗺️ {tours.length} {tours.length === 1 ? 'tour' : 'tours'} found
                </span>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-xl text-gray-500">Loading amazing tours...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center justify-between">
                <p className="text-red-600 font-semibold">⚠️ {errorText}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm whitespace-nowrap"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Tours Grid */}
            {!isLoading && tours && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 auto-rows-max">
                {tours.map((tour, index) => (
                  <div
                    key={tour._id}
                    className="animate-fade-slide-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TourCard tour={tour} />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && (!tours || tours.length === 0) && (
              <div className="text-center py-12">
                <p className="text-2xl text-gray-500">No tours found</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          {!isLoading && tours && (
            <div className="lg:w-80">
              <Bestsellers tours={tours} />
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide-in {
          animation: fadeSlideIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HomePage;