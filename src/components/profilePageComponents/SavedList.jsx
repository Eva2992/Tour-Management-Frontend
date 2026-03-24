import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axiosInstance from '../../api/axios';
import { buildTourImageUrl } from '../../api/config';

const SavedList = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [savedTours, setSavedTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);

  useEffect(() => {
    const fetcSavedTours = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/tours');
        const allTours = res.data.data.doc;
        
        // Filter tours that are in user's savedTours array
        const savedTourIds = (user?.savedTours || [])
          .map((item) => (typeof item === 'string' ? item : item?._id))
          .filter(Boolean);

        if (savedTourIds.length > 0) {
          const saved = allTours.filter(tour => 
            savedTourIds.includes(tour._id)
          );
          setSavedTours(saved);
        } else {
          setSavedTours([]);
        }
      } catch (error) {
        console.error('Error fetching saved tours:', error);
        setSavedTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetcSavedTours();
  }, [user?.savedTours]); // re render 

  const handleRemove = async (tourId) => {
    try {
      const res = await axiosInstance.patch('/users/remove-tour', { savedTours: tourId });
      const updatedUser = res?.data?.data?.doc || res?.data?.data?.user;
      if (updatedUser) {
        setUser(updatedUser);
      }
      setSavedTours(savedTours.filter(tour => tour._id !== tourId));
      setConfirmRemoveId(null);
      setMessage({ type: 'success', text: '❤️ Tour removed from saved list!' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: '❌ Failed to remove tour.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your saved tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800">💖 Saved Tours</h2>
        <p className="text-gray-500 mt-1">Tours you've marked for later.</p>
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

      {savedTours.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <p className="text-5xl mb-4">💭</p>
          <p className="text-gray-600 text-lg font-semibold">No saved tours yet</p>
          
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTours.map((tour) => (
            <div key={tour._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
              {/* Tour Image */}
              <div className="relative h-48 overflow-hidden bg-emerald-100">
                <img
                  src={buildTourImageUrl(tour.imageCover)}
                  alt={tour.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2">
                  ❤️
                </div>
              </div>

              {/* Tour Info */}
              <div className="p-4">
                <p className="text-xs text-emerald-600 font-semibold uppercase">{tour.difficulty}</p>
                <h3 className="text-lg font-bold text-gray-800 mt-1">{tour.name}</h3>
                
                {/* Tour Details */}
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p>📍 {tour.startLocation?.description || 'Location TBA'}</p>
                  <p>⏱️ {tour.duration} days</p>
                  <p className="font-bold text-emerald-600">
                    ${tour.price}
                    <span className="text-gray-400 line-through text-xs ml-2">
                      ${Math.round(tour.price / 0.88)}
                    </span>
                  </p>
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
                      <p className="text-xs font-semibold text-red-600 mb-2">Remove this tour from saved?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRemove(tour._id)}
                          className="flex-1 px-3 py-1.5 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition text-xs"
                        >
                          Yes, Remove
                        </button>
                        <button
                          onClick={() => setConfirmRemoveId(null)}
                          className="flex-1 px-3 py-1.5 bg-white text-gray-600 font-semibold rounded-md border border-gray-200 hover:bg-gray-50 transition text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmRemoveId(tour._id)}
                      className="w-full px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition text-sm"
                    >
                      Remove from Saved
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

export default SavedList;
