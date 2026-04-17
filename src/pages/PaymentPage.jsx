import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useTourById from '../hooks/useTourById';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../api/axios';

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const { data: tour, isLoading, isError } = useTourById(id);

  const bookedTourIds = useMemo(
    () => (user?.bookedTours || []).map((item) => (typeof item === 'string' ? item : item?._id)).filter(Boolean),
    [user?.bookedTours]
  );

  const isAlreadyBooked = id ? bookedTourIds.includes(id) : false;

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showFeedback('error', 'Please log in to continue with booking.');
      return;
    }

    if (!cardNumber.trim() || !cardName.trim() || !expiry.trim() || !cvv.trim()) {
      showFeedback('error', 'Please fill all payment fields.');
      return;
    }

    if (isAlreadyBooked) {
      showFeedback('success', 'This tour is already in your bookings.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await axiosInstance.patch('/users/add-tour', { bookedTours: id });
      const updatedUser = res?.data?.data?.doc || res?.data?.data?.user;
      if (updatedUser) setUser(updatedUser);
      showFeedback('success', 'Payment submitted (dummy). Booking confirmed.');
      setTimeout(() => navigate('/profile'), 900);
    } catch (error) {
      showFeedback('error', error?.response?.data?.message || 'Unable to complete booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-emerald-600 font-semibold hover:text-emerald-800 transition"
        >
          ← Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-emerald-700 mb-2">Checkout</h1>
          <p className="text-gray-600 mb-6">
            {isLoading ? 'Loading tour...' : isError ? 'Tour details unavailable' : `Booking: ${tour?.name || 'Selected Tour'}`}
          </p>

          {!user && (
            <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 font-semibold">
              Please log in first to continue with booking.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="card">Credit / Debit Card</option>
                <option value="upi">UPI (Dummy)</option>
                <option value="bank">Bank Transfer (Dummy)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Card Holder Name</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Name on card"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !user}
              className={`w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all ${submitting || !user ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Submitting...' : 'Submit Payment'}
            </button>

            {feedback && (
              <div
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}
              >
                {feedback.text}
              </div>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentPage;