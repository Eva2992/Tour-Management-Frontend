import { useEffect, useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthModal = ({ onClose, initialTab = 'login', onAuthSuccess }) => {
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/25"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 p-8 z-10 rounded-2xl bg-white/18 border border-white/35 backdrop-blur-lg shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl font-bold"
        >
          ✕
        </button>

        {/* Logo */}
        <h2 className="text-2xl font-bold text-white text-center mb-6 drop-shadow-sm">
          🌍 Book Your Trip
        </h2>

        {/* Forms */}
        {tab === 'login'
          ? <LoginForm onSuccess={(authenticatedUser) => {
            onAuthSuccess?.(authenticatedUser);
            onClose();
          }} />
          : <SignupForm onSuccess={(authenticatedUser) => {
            onAuthSuccess?.(authenticatedUser);
            onClose();
          }} />
        }

        {/* Plain switch text */}
        <p className="mt-6 text-center text-sm text-white">
          {tab === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <span
                onClick={() => setTab('signup')}
                className="font-semibold text-emerald-200 hover:text-emerald-100 cursor-pointer"
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span
                onClick={() => setTab('login')}
                className="font-semibold text-emerald-200 hover:text-emerald-100 cursor-pointer"
              >
                Log in
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;