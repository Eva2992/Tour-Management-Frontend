import { useEffect, useState } from 'react';
import {useAuth} from '../../hooks/useAuth';
import axiosInstance from '../../api/axios';

const StarRating = ({ rating, onRate }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        onClick={() => onRate && onRate(star)}
        className={`w-5 h-5 ${onRate ? 'cursor-pointer' : ''} ${
          star <= rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ))}
  </div>
);

const MyReviewTab = ()=> {

    const {user} = useAuth();
    const [reviews , setReviews] = useState(null) ;
    const [loading , setLoading] = useState(true); // state
    const [editingId , setEditingId] = useState(null)
  const [editData , setEditData] = useState({rating : 0 , reviewText : ''})
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect (() => { // for running my side effect  , api call is a side effect ( outside of react rendering process lol
    const fetchReviews = async () => {
      if (!user?._id) {
        setReviews([]);
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get(`/reviews?referenceUser=${user._id}`);
        setReviews(res.data.data.doc);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  } , [user?._id]); // run when user changes , 
               // dependency array , [] means run once ,[user] means run when user changes , no array means run on every render 

    const handleEdit = (review) => { // when click on edit button  , now its edit mood
       
        setEditingId(review._id); //// navigate  open edit modal
        setEditData({ rating: review.rating, reviewText: review.review || '' });
    }



    const handleSaveEdit = async (id) => {
        try {
            await axiosInstance.patch(`/reviews/${id}`, {
              rating: editData.rating,
              review: editData.reviewText,
            });
            // Refetch reviews after save
            const res = await axiosInstance.get(`/reviews?referenceUser=${user._id}`); //{{URL}}/api/v1/reviews?referenceUser=5c88fa8cf4afda39709c2966
            setReviews(res.data.data.doc);
            setEditingId(null);
            
    } catch {
        alert('Failed to update review. try aagian bro  .');
    }

  };

  const handleDelete = async (id) => {
    try {

      await axiosInstance.delete(`/reviews/${id}`) ;
      // Refetch reviews after delete
      const res = await axiosInstance.get(`/reviews?referenceUser=${user._id}`);
      setReviews(res.data.data.doc);
      setDeleteConfirmId(null);
    } catch {
        alert('Failed to delete review. try aagian bro  .');

    } 
};

if (loading) return (
    <div className="flex justify-center py-12">
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );

  if (!reviews || reviews.length === 0) return (
    <div className="text-center py-12 text-gray-400 text-lg">
      You haven't written any reviews yet.
    </div>
  );

  return (
    <div className="space-y-4">
      {reviews.map((review) => (  // from review state we map each review and show with edit option
        <div key={review._id} className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-bold text-emerald-600 mb-1">
                🗺️ {review.referenceTour?.name || 'Tour'}
              </p>

              {editingId === review._id ? (
                <div className="space-y-3">
                  <StarRating
                    rating={editData.rating}
                    onRate={(star) => setEditData({ ...editData, rating: star })}  // read rating(star) from input and set to editData state
                  />
                  <textarea
                    value={editData.reviewText}
                    onChange={(e) => setEditData({ ...editData, reviewText: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-emerald-200 focus:outline-none focus:border-emerald-400 transition text-gray-700 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(review._id)}
                      className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <StarRating rating={review.rating} />
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">{review.review}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.createAt || review.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>

            {editingId !== review._id && ( // show edit and delete buttons only when not editing
              <div className="flex flex-col gap-2">
                {deleteConfirmId === review._id ? (
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="px-3 py-1.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition text-xs"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(review)} //editing moode
                      className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(review._id)}
                      className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyReviewTab;
