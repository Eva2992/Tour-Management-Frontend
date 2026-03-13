import { useState } from 'react';
import { buildTourImageUrl } from '../api/config';

const TourCard = ({ tour }) => {
  console.log('tour.imageCover:', tour.imageCover);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Dummy discount
  const discountPercent = 12;
  const originalPrice = Math.round(tour.price / (1 - discountPercent / 100));
  const discountedPrice = tour.price;

  return (
    <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      {/* Image Container with Placeholder */}
      <div className="relative h-64 bg-gradient-to-br from-emerald-100 to-teal-100 overflow-hidden">
        
        {tour.imageCover ? (
          <img
            src={buildTourImageUrl(tour.imageCover)}
            alt={tour.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = '/api/placeholder/400/300';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-emerald-400 text-5xl">
            🏔️
          </div>
        )}

        

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 ${
            isWishlisted
              ? 'bg-red-500 text-white'
              : 'bg-white text-red-300 hover:text-red-500'
          }`}
          title="Add to wishlist"
        >
          <svg className="w-6 h-6" fill={isWishlisted ? 'currentColor' : 'none'} stroke={isWishlisted ? 'none' : 'currentColor'} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isWishlisted ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Discount Badge */}
        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
          -{discountPercent}% OFF
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        {/* Location & Title */}
        <div className="flex items-start gap-2 mb-2">
          <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 6h2v2h-2z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors flex-1">
            {tour.name}
          </h3>
        </div>

        {/* Info Row: Rating, Difficulty, Duration, Start Date */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs bg-emerald-50 p-2 rounded-lg">
          {/* Rating */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span className="font-bold text-gray-800">{tour.ratingsAverage || 4.5}</span>
            </div>
            <span className="text-gray-600 text-xs">Rating</span>
          </div>
          
          
          
          {/* Duration */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="text-teal-600">⏱️</span>
              <span className="font-bold text-gray-800">{tour.duration}</span>
            </div>
            <span className="text-gray-600 text-xs">Days</span>
          </div>
          
          {/* Start Date */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="text-emerald-600">📅</span>
              <span className="font-bold text-gray-800">
                {tour.startDates && tour.startDates.length > 0
                  ? new Date(tour.startDates[0]).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'TBA'}
              </span>
            </div>
            <span className="text-gray-600 text-xs">Start</span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.summary}</p>

        {/* Price */}
        <div className="mb-4 pb-4 border-b-2 border-emerald-100">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">${discountedPrice}</span>
            <span className="text-sm text-gray-400 line-through">${originalPrice}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => alert('🎫 Booking modal coming soon!')}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Book Now
          </button>
          <button
            className="px-4 py-2 bg-emerald-100 text-emerald-600 font-bold rounded-lg hover:bg-emerald-200 transition-all duration-300 border-2 border-emerald-300"
            onClick={() => alert('📄 Details page coming soon!')}
          >
            Details
          </button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default TourCard;