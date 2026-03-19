import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../api/axios';

const SignupForm = ({ onSuccess }) => {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.passwordConfirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }
    try {
      setIsLoading(true);
      setError('');
      const res = await axiosInstance.post('/users/signup', form);
      try {
        const meRes = await axiosInstance.get('/users/me');
        const normalizedUser = meRes?.data?.data?.doc || meRes?.data?.data?.user;
        if (normalizedUser) {
          setUser(normalizedUser);
        } else {
          setUser(res?.data?.data?.doc || res?.data?.data?.user || null);
        }
      } catch {
        setUser(res?.data?.data?.doc || res?.data?.data?.user || null);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {['name', 'email', 'password', 'passwordConfirm'].map((field) => (
        <div key={field}>
          <label className="block text-sm font-semibold text-gray-700 mb-1 capitalize">
            {field === 'passwordConfirm' ? 'Confirm Password' : field}
          </label>
          <input
            type={field.includes('password') || field.includes('Password') ? 'password' : field === 'email' ? 'email' : 'text'}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field === 'passwordConfirm' ? '••••••••' : field === 'password' ? '••••••••' : ''}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-emerald-400 transition text-gray-700"
          />
        </div>
      ))}

      {error && (
        <p className="text-red-500 text-sm font-semibold">⚠️ {error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md disabled:opacity-50"
      >
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </button>
    </div>
  );
};

export default SignupForm;
