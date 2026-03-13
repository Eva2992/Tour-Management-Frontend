import TourCard from './TourCard';
import { buildTourImageUrl } from '../api/config';

const Bestsellers = ({ tours }) => {
  // Get top 3 tours by rating
  const topTours = tours
    ?.sort((a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0))
    ?.slice(0, 3) || [];

  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* Bestsellers Header */}
      <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-6 border-2 border-emerald-300">
        <h2 className="text-2xl font-bold text-emerald-800 mb-2">🏆 Best Sellers</h2>
        <p className="text-emerald-700 text-sm">Top rated tours loved by travelers</p>
      </div>

      {/* Bestseller Cards */}
      <div className="space-y-4">
        {topTours.length > 0 ? (
          topTours.map((tour, index) => (
            <div
              key={tour._id}
              className="animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Mini Tour Card */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 border-emerald-500 hover:border-l-8">
                {/* Image */}
                <div className="h-32 bg-gradient-to-br from-emerald-100 to-teal-100 relative overflow-hidden">
                  {tour.imageCover ? (
                    <img
                      src={buildTourImageUrl(tour.imageCover)}
                      alt={tour.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-emerald-300 text-3xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                  )}
                  {/* Ranking Badge */}
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                    #{index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="font-bold text-emerald-800 text-sm mb-1 line-clamp-1">
                    {tour.name}
                  </h3>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-bold text-gray-800">{tour.ratingsAverage || 4.5}</span>
                    </div>
                    <span className="text-teal-600 font-semibold">{tour.duration}d</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-emerald-600">${tour.price}</span>
                    <button
                      onClick={() => alert('🎫 Booking modal coming soon!')}
                      className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded hover:bg-emerald-600 transition-all duration-200 transform hover:scale-105"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading top tours...</p>
          </div>
        )}
      </div>

      {/* Special Offer Box */}
      <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-xl p-5 border-2 border-red-300 text-center">
        <p className="text-sm text-gray-600 mb-2">🎉 Limited Time Offer</p>
        <h3 className="text-2xl font-bold text-red-600 mb-2">Get 10% OFF</h3>
        <p className="text-red-700 text-sm mb-4">On your first tour booking</p>
        <button
          onClick={() => alert('🎟️ Coupon code: FIRST10 applied!')}
          className="w-full px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
        >
          Claim Offer
        </button>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-r from-cyan-100 to-teal-100 rounded-xl p-5 border-2 border-cyan-300">
        <h4 className="font-bold text-cyan-800 mb-3">📧 Stay Updated</h4>
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full px-3 py-2 rounded-lg border-2 border-cyan-300 focus:border-cyan-500 outline-none mb-3"
          onClick={() => alert('✉️ Newsletter signup coming soon!')}
          onChange={() => {}}
        />
        <button
          onClick={() => alert('✉️ Newsletter signup coming soon!')}
          className="w-full px-4 py-2 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 transition-all duration-200"
        >
          Subscribe
        </button>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </aside>
  );
};

export default Bestsellers;
