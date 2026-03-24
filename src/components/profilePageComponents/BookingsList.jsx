import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axiosInstance from '../../api/axios';
import { buildTourImageUrl } from '../../api/config';

const BookingsList = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [bookedTours, setBookedTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);

  useEffect(() => {
    const fetchBookedTours = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/tours'); //{{URL}}/api/v1/tours (getingg all tours
        const allTours = res.data.data.doc;
        
        
        const bookedTourIds = (user?.bookedTours || [])
          .map((item) => (typeof item === 'string' ? item : item?._id))
          .filter(Boolean);

        if (bookedTourIds.length > 0) {// fetching users bookedtour
          const booked = allTours.filter(tour => 
            bookedTourIds.includes(tour._id)
          );
          setBookedTours(booked);
        } else {
          setBookedTours([]);
        }
      } catch (error) {
        console.error('Error fetching booked tours:', error);
        setBookedTours([]);
      } finally {
        setLoading(false);
      }
    }; // re render when user changes (login/logout)

    fetchBookedTours();
  }, [user?.bookedTours]); // re render when user changes (login/logout)

  const handleRemoveBooking = async (tourId) => {
    try {
      const res = await axiosInstance.patch('/users/remove-tour', { bookedTours: tourId }); // http://localhost:3000/api/v1/users/remove-tour
      const updatedUser = res?.data?.data?.doc || res?.data?.data?.user;
      if (updatedUser) {
        setUser(updatedUser);
      }
      setBookedTours(bookedTours.filter(tour => tour._id !== tourId));
      setConfirmRemoveId(null);
      setMessage({ type: 'success', text: '✅ Booking cancelled!' });
      setTimeout(() => setMessage(null), 3000);
    } catch{
      setMessage({ type: 'error', text: '❌ Failed to cancel booking.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800">🎒 Bookings & Trips</h2>
        <p className="text-gray-500 mt-1">Your upcoming and past tour bookings.</p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-2xl text-sm font-semibold ${
          message.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {bookedTours.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <p className="text-5xl mb-4">🗺️</p>
          <p className="text-gray-600 text-lg font-semibold">No bookings yet</p>
          <p className="text-gray-400 text-sm mt-2">Book a tour to see your upcoming trips here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookedTours.map((tour) => (
            <div key={tour._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition border-l-4 border-emerald-500">
              {/* Tour Image */}
              <div className="relative h-48 overflow-hidden bg-emerald-100">
                <img
                  src={buildTourImageUrl(tour.imageCover)}
                  alt={tour.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-2">
                  ✅
                </div>
              </div>

              {/* Tour Info */}
              <div className="p-4">
                <p className="text-xs text-emerald-600 font-semibold uppercase">Booked</p>
                <h3 className="text-lg font-bold text-gray-800 mt-1">{tour.name}</h3>
                
                {/* Tour Details */}
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p>📍 {tour.startLocation?.description || 'Location TBA'}</p>
                  <p>⏱️ {tour.duration} days</p>
                  <p className="font-bold text-emerald-600">${tour.price}</p>
                  <p>👥 {tour.maxGroupSize || 'N/A'} people max</p>
                </div>

                {/* Buttons */}
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => navigate(`/tours/${tour._id}`)}
                    className="w-full px-4 py-2 bg-emerald-50 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-100 transition"
                  >
                    View Details
                  </button>
                  {confirmRemoveId === tour._id ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-2">
                      <p className="text-xs font-semibold text-red-600 mb-2">Cancel this booking?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRemoveBooking(tour._id)}
                          className="flex-1 px-3 py-1.5 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition text-xs"
                        >
                          Yes, Cancel
                        </button>
                        <button
                          onClick={() => setConfirmRemoveId(null)}
                          className="flex-1 px-3 py-1.5 bg-white text-gray-600 font-semibold rounded-md border border-gray-200 hover:bg-gray-50 transition text-xs"
                        >
                          Keep Booking
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmRemoveId(tour._id)}
                      className="w-full px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition text-sm"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsList;
