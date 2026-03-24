import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../api/axios';

const LoginForm = ({ onSuccess }) => {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      setIsLoading(true);
      setError('');
      const res = await axiosInstance.post('/users/login', { email, password });
      let authenticatedUser = null;
      try {
        const meRes = await axiosInstance.get('/users/me');
        const normalizedUser = meRes?.data?.data?.doc || meRes?.data?.data?.user;
        if (normalizedUser) {
          authenticatedUser = normalizedUser;
          setUser(normalizedUser);
        } else {
          authenticatedUser = res?.data?.data?.doc || res?.data?.data?.user || null;
          setUser(authenticatedUser);
        }
      } catch {
        authenticatedUser = res?.data?.data?.doc || res?.data?.data?.user || null;
        setUser(authenticatedUser);
      }
      onSuccess(authenticatedUser);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-emerald-400 transition text-gray-700"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-emerald-400 transition text-gray-700"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm font-semibold">⚠️ {error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md disabled:opacity-50"
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>
    </div>
  );
};

export default LoginForm;