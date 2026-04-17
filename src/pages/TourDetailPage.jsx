import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useTourById from '../hooks/useTourById';
import useReviews from '../hooks/useReviews';
import TourMap from '../components/TourMap';
import ReviewForm from '../components/ReviewForm';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { buildTourImageUrl, buildUserImageUrl } from '../api/config';
import axiosInstance from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import ReactMarkdown from 'react-markdown';



const StarRating = ({ rating }) => { // star rating
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
};

const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const { user, setUser } = useAuth();

  const { data: tour, isLoading, isError, error } = useTourById(id);
  const { data: reviews, refetch: refetchReviews } = useReviews(id);

  const allImages = [
    tour?.imageCover,
    ...(tour?.images || [])
  ].filter(Boolean);

  useEffect(() => {
    if (allImages.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [allImages.length]);

  useEffect(() => {
    if (currentImageIndex >= allImages.length) {
      setCurrentImageIndex(0);
    }
  }, [allImages.length, currentImageIndex]);

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
    </div>
  );

  if (isError || !tour) {
    const statusCode = error?.response?.status;
    const errorMessage =
      statusCode >= 500
        ? `Server error (${statusCode}). Please check backend logs.`
        : error?.response?.data?.message || 'Tour not found.';

    return (
      <div className="flex justify-center items-center h-screen px-4">
        <p className="text-xl text-red-500 text-center">{errorMessage}</p>
      </div>
    );
  }

  const discountPercent = 12;
  const originalPrice = Math.round(tour.price / (1 - discountPercent / 100));
  const savedTourIds = (user?.savedTours || []).map((item) => (typeof item === 'string' ? item : item?._id)).filter(Boolean);
  const bookedTourIds = (user?.bookedTours || []).map((item) => (typeof item === 'string' ? item : item?._id)).filter(Boolean);
  const isWishlisted = savedTourIds.includes(tour._id);
  const isBooked = bookedTourIds.includes(tour._id);

  const patchAddTour = async (payload) => axiosInstance.patch('/users/add-tour', payload);

  const patchRemoveTour = async (payload) => axiosInstance.patch('/users/remove-tour', payload);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleToggleWishlist = async () => {
    if (actionLoading) return;

    if (!user) {
      showFeedback('error', 'Please log in to add tours to wishlist.');
      return;
    }

    try {
      setActionLoading(true);
      if (isWishlisted) {
        const res = await patchRemoveTour({ savedTours: tour._id });
        const updatedUser = res?.data?.data?.doc || res?.data?.data?.user;
        if (updatedUser) setUser(updatedUser);
        showFeedback('success', 'Removed from wishlist.');
      } else {
        const res = await patchAddTour({ savedTours: tour._id });
        const updatedUser = res?.data?.data?.doc || res?.data?.data?.user;
        if (updatedUser) setUser(updatedUser);
        showFeedback('success', 'Added to wishlist.');
      }
    } catch (error) {
      showFeedback('error', error?.response?.data?.message || 'Failed to update wishlist.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBookNow = async () => {
    if (!user) {
      showFeedback('error', 'Please log in to book this tour.');
      return;
    }

    try {
      setActionLoading(true);
      const res = await patchAddTour({ bookedTours: tour._id });
      const updatedUser = res?.data?.data?.doc || res?.data?.data?.user;
      if (updatedUser) setUser(updatedUser);
      showFeedback('success', 'Booked successfully! Added to your bookings.');
    } catch (error) {
      showFeedback('error', error?.response?.data?.message || 'Failed to book this tour.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!user) {
      showFeedback('error', 'Please log in first.');
      return;
    }

    try {
      setActionLoading(true);
      const res = await patchRemoveTour({ bookedTours: tour._id });
      const updatedUser = res?.data?.data?.doc || res?.data?.data?.user;
      if (updatedUser) setUser(updatedUser);
      showFeedback('success', 'Booking canceled successfully.');
    } catch (error) {
      showFeedback('error', error?.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="w-full px-4 sm:px-5 lg:px-6 py-12">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-800 transition"
        >
          ← Back to Tours
        </button>

        {/* Top Section — Image + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">

          {/* Left — Image slider */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl h-[30rem] bg-emerald-100">
            <img
              src={buildTourImageUrl(allImages[currentImageIndex])}
              alt={tour.name}
              className="w-full h-full object-cover transition-all duration-500"
            />

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {allImages.map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right — Tour Details */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Name */}
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{tour.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={tour.ratingsAverage} />
                <span className="text-gray-600 font-semibold">
                  {tour.ratingsAverage} ({tour.ratingsQuantity || reviews?.length || 0} reviews)
                </span>
              </div>

              {/* info */}
              <div className="grid grid-cols-2 gap-4 mb-6 bg-emerald-50 p-4 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Duration</p>
                  <p className="font-bold text-gray-800">⏱ {tour.duration} days</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Difficulty</p>
                  <p className="font-bold text-gray-800 capitalize">
                    {tour.difficulty === 'easy' ? '🟢' : tour.difficulty === 'medium' ? '🟡' : '🔴'} {tour.difficulty}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Group Size</p>
                  <p className="font-bold text-gray-800">👥 Max {tour.maxGroupSize}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Next Date</p>
                  <p className="font-bold text-gray-800">
                    📅 {tour.startDates?.[0]
                      ? new Date(tour.startDates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'TBA'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Start Location</p>
                  <p className="font-bold text-gray-800">📍 {tour.startLocation?.description || 'N/A'}</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-emerald-600">${tour.price}</span>
                <span className="text-lg text-gray-400 line-through">${originalPrice}</span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded-full">
                  -{discountPercent}% OFF
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!isBooked && (
                <button
                  onClick={handleBookNow}
                  disabled={actionLoading}
                  className={`flex-[0.8] min-w-[14.5rem] text-white border-2 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 ${actionLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  Book Now
                </button>
              )}

              {isBooked && (
                <>
                  <button
                    onClick={handleCancelBooking}
                    disabled={actionLoading}
                    className={`flex-1 text-white border-2 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 ${actionLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    Cancel Booking
                  </button>
                  <button
                    onClick={() => navigate(`/payment/${tour._id}`)}
                    disabled={actionLoading}
                    className={`flex-1 text-white border-2 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 ${actionLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    Checkout
                  </button>
                </>
              )}

              <div
                onClick={handleToggleWishlist}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggleWishlist();
                  }
                }}
                role="button"
                tabIndex={0}
                className={`px-5 py-4 rounded-xl border-2 font-bold transition-all duration-300 ${
                  isWishlisted
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'bg-white border-red-200 text-red-500 hover:bg-red-50'
                } ${actionLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                title="Add to wishlist"
              >
                {isWishlisted ? '♥' : '♡'}
              </div>
            </div>

            {feedback && (
              <div
                className={`mt-3 rounded-lg px-3 py-2 text-xs font-semibold ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}
              >
                {feedback.text}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-[90rem] mx-auto">
          {/* Description */}
          <div className="bg-white rounded-2xl shadow p-8 mb-10">
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">About This Tour</h2>
            {tour.description?.split('\n').map((para, i) => (
              <p key={i} className="text-gray-600 leading-relaxed mb-3">{para}</p>
            ))}
          </div>

          {/* Map */}
          {tour.locations && tour.locations.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-8 mb-10">
              <h2 className="text-2xl font-bold text-emerald-600 mb-2">Tour Locations</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {tour.locations.map((loc) => (
                  <span key={loc._id} className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full">
                    📍 Day {loc.day} — {loc.description}
                  </span>
                ))}
              </div>
              <TourMap locations={tour.locations} />
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold text-emerald-600 mb-6">
              Reviews {reviews && `(${reviews.length})`}
            </h2>

            {!reviews || reviews.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No reviews yet.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="flex gap-4 pb-6 border-b border-gray-100 last:border-none">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {review.referenceUser?.photo ? (
                        <img
                          src={buildUserImageUrl(review.referenceUser.photo)}
                          alt={review.referenceUser.name}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${review._id}`;
                          }}
                        />
                      ) : (
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review._id}`}
                          alt="Anonymous"
                          className="w-12 h-12 rounded-full bg-emerald-100"
                        />
                      )}
                    </div>

                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-gray-800">
                          {review.referenceUser?.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(review.createAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </p>
                      </div>
                      <StarRating rating={review.rating} />
                      <p className="text-gray-600 mt-2 leading-relaxed">{review.review}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <ReviewForm tourId={id} onReviewSubmitted={refetchReviews} />
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default TourDetailPage;