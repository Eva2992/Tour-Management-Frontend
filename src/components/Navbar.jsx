import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../api/axios';
import { buildUserImageUrl } from '../api/config';
import AuthModal from './AuthModal';
import guestUserIcon from '../assets/user.jpg';

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [photoLoadError, setPhotoLoadError] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  useEffect(() => {
    setPhotoLoadError(false);
  }, [user?._id, user?.photo]);

  const showUserPhoto = Boolean(user?.photo) && !photoLoadError;
  const userInitial = user?.name?.trim()?.[0]?.toUpperCase() || 'U';

  const navigateProfileSection = (section) => {
    navigate(`/profile?section=${section}`);
    setProfileOpen(false);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    if (authenticatedUser?.role === 'admin') {
      navigate('/admin');
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.get('/users/logout');
    } catch {
      // logout should still clear local auth even if request fails
    } finally {
      setUser(null);
      navigate('/');
      setProfileOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b-4 border-emerald-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <h1 className="text-3xl font-bold text-emerald-600">🌍 Book Your Trip</h1>
          </div>

          <div className="flex-1" /> 

          {/* Right - Profile */}
          <div className="relative flex flex-col items-center">
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setProfileOpen((prev) => !prev);
                }
              }}
              role="button"
              tabIndex={0}
              className="w-14 h-14 rounded-full overflow-hidden bg-transparent border-0 hover:shadow-lg transition-shadow flex-shrink-0 cursor-pointer"
              title={user ? user.name : 'Guest'}
              aria-label="Profile"
            >
              {!user && (
                <img
                  src={guestUserIcon}
                  alt="Guest"
                  className="w-full h-full object-cover rounded-full"
                />
              )}

              {user && showUserPhoto && (
                <img
                  src={buildUserImageUrl(user.photo)}
                  
                  className="w-full h-full object-cover rounded-full"
                  onError={() => setPhotoLoadError(true)}
                />
              )}

              {user && !showUserPhoto && (
                <div className="w-full h-full rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-2xl font-bold">
                  {userInitial}
                </div>
              )}
            </div>

            {/* Name below icon — only when logged in */}
            {user && (
              <span className="text-xs font-semibold text-emerald-700 mt-1 max-w-[80px] truncate">
                {user.name.split(' ')[0]}
              </span>
            )}

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-14 w-64 bg-white rounded-lg shadow-xl border-2 border-emerald-200 overflow-hidden z-50">
                {user ? (
                  <>
                    <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100">
                      <p className="text-sm text-emerald-700 font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    {user.role === 'admin' ? (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setProfileOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-emerald-50 text-gray-700 font-semibold transition-colors border-b border-emerald-100"
                      >
                        🛠️ Admin Dashboard
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => navigateProfileSection('account')}
                          className="w-full px-4 py-3 text-left hover:bg-emerald-50 text-gray-700 font-semibold transition-colors border-b border-emerald-100"
                        >
                          👤 My Account
                        </button>
                        <button
                          onClick={() => navigateProfileSection('bookings')}
                          className="w-full px-4 py-3 text-left hover:bg-emerald-50 text-gray-700 font-semibold transition-colors border-b border-emerald-100"
                        >
                          🎒 Bookings & Trips
                        </button>
                        <button
                          onClick={() => navigateProfileSection('saved')}
                          className="w-full px-4 py-3 text-left hover:bg-emerald-50 text-gray-700 font-semibold transition-colors border-b border-emerald-100"
                        >
                          ❤️ Saved List
                        </button>
                        <button
                          onClick={() => navigateProfileSection('reviews')}
                          className="w-full px-4 py-3 text-left hover:bg-emerald-50 text-gray-700 font-semibold transition-colors border-b border-emerald-100"
                        >
                          ⭐ My Reviews
                        </button>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-600 font-semibold transition-colors"
                    >
                      ↪ Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setAuthMode('login'); setProfileOpen(false); }}
                      className="w-full px-4 py-3 text-left hover:bg-emerald-50 text-gray-700 font-semibold transition-colors border-b border-emerald-100"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => { setAuthMode('signup'); setProfileOpen(false); }}
                      className="w-full px-4 py-3 text-left hover:bg-emerald-50 text-gray-700 font-semibold transition-colors"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {authMode && (
        <AuthModal
          initialTab={authMode}
          onClose={() => setAuthMode(null)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </nav>
  );
};

export default Navbar;