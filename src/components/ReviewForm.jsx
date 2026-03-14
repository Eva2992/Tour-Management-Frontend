
import { useState } from 'react';
import axiosInstance from '../api/axios';

const ReviewForm = ({ tourId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  const handleSubmit = async () => {
    if (rating === 0) {
      setMessage({ type: 'error', text: 'Please select a rating.' });
      return;
    }
    if (reviewText.trim().length === 0) {
      setMessage({ type: 'error', text: 'Please write a review.' });
      return;
    }

    try {
      setIsSubmitting(true);
      await axiosInstance.post('/reviews', { // {{URL}}/api/v1/reviews
        review: reviewText,
        rating,
        referenceTour: tourId,
      });
      setMessage({ type: 'success', text: 'Review submitted successfully!' });
      setRating(0);
      setReviewText('');
      onReviewSubmitted(); // refresh reviews list
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong.';
      // for  401 
      if (err.response?.status === 401) {
        setMessage({ type: 'error', text: 'You are not logged in. Please login to submit a review.' });
      } else {
        setMessage({ type: 'error', text: msg });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t-2 border-emerald-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Write a Review</h3>

      
      <div className="flex items-center gap-1 mb-4">  {/* Star Rating Selector */}
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-8 h-8 cursor-pointer transition-colors duration-150 ${
              star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-gray-500 text-sm font-semibold">
            {['', 'Terrible', 'Bad', 'OK', 'Good', 'Amazing'][rating]}
          </span>
        )}
      </div>

      {/*  Text */}
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Share your experience..."
        rows={4}
        className="w-full p-4 rounded-xl border-2 border-emerald-200 focus:outline-none focus:border-emerald-500 transition-colors text-gray-700 resize-none mb-4"
      />

      {/* Message */}
      {message && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-semibold ${
          message.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          {message.type === 'success' ? '✅' : '⚠️'} {message.text}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
};

export default ReviewForm;