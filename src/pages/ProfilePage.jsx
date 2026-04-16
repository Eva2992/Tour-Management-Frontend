import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { buildUserImageUrl } from '../api/config';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AccountTab from '../components/profilePageComponents/AccountTab';
import MyReviewTab from '../components/profilePageComponents/MyReviewTab';
import SavedList from '../components/profilePageComponents/SavedList';
import BookingsList from '../components/profilePageComponents/BookingsList';

const menuItems = [
  { key: 'account', label: 'My Account', icon: '👤' },
  { key: 'bookings', label: 'Bookings & Trips', icon: '🎒' },
  { key: 'saved', label: 'Saved List', icon: '❤️' },
  { key: 'reviews', label: 'My Reviews', icon: '⭐' },
  { key: 'logout', label: 'Logout', icon: '↪' },
];



const accountSummaryFields = [
  { key: 'name', label: 'Name', valueKey: 'name', action: 'Edit', targetId: 'account-info' },
  { key: 'email', label: 'Email', valueKey: 'email', action: 'Edit', targetId: 'account-info' },
  { key: 'password', label: 'Password', valueKey: 'password', action: 'Edit', targetId: 'account-password' },
];

const ProfilePage = () => {
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get('section') || 'account';

  useEffect(() => {
    if (!loading && !user) {
      navigate('/', { replace: true });
    }

    if (!loading && user?.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [loading, user, navigate]);

  const accountSummary = useMemo(
    () => ({
      name: user?.name || 'Not set',
      email: user?.email || 'Not set',
      password: '••••••••••',
    }),
    [user]
  );

  const handleMenuClick = (itemKey) => {
    if (itemKey === 'logout') {
      setUser(null);
      navigate('/');
      return;
    }

    setSearchParams({ section: itemKey });
  };

  const jumpToFormSection = (targetId) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section className="rounded-3xl bg-gradient-to-r from-teal-400 to-cyan-200 text-gray-800 shadow-xl p-8 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            {/* Profile Icon */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white/40 flex items-center justify-center text-6xl font-bold flex-shrink-0">
                {user.photo ? (
                  <img
                    src={buildUserImageUrl(user.photo)}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id}`;
                    }}
                  />
                ) : (
                  <span>{user.name?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </div>
            </div>

            {/* Text & Promo Boxes */}
            <div className="flex-1">
              <h2 className="text-emerald-700 text-lg font-bold">Welcome to your profile</h2>
              <h3 className="text-3xl  text-emerald sm:text-3xl font-bold mt-2">Hi, {user.name}</h3>
              
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md hover:shadow-lg transition flex items-start gap-4">
                  <div className="text-5xl flex-shrink-0">🎟️</div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">SAVE 10% on your first Trip </p>
                    <p className="text-gray-600 text-sm mt-1"> booking with promo code rewards .</p>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md hover:shadow-lg transition flex items-start gap-4">
                  <div className="text-5xl flex-shrink-0">⭐</div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">5 trips left to upgrade to Pro</p>
                    <p className="text-gray-600 text-sm mt-1">and Premium membership benefits.</p>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md hover:shadow-lg transition flex items-start gap-4">
                  <div className="text-5xl flex-shrink-0">🏆</div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">2 active rewards</p>
                    <p className="text-gray-600 text-sm mt-1">Showcase your earned rewards and unlock coupon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          <aside className="bg-white rounded-2xl shadow p-3 lg:sticky lg:top-24">
            <p className="px-3 pb-2 text-xs font-bold tracking-wide text-gray-400 uppercase">Profile Menu</p>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = activeSection === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleMenuClick(item.key)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-white shadow'
                        : item.key === 'logout'
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-gray-700 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    {isActive && item.key !== 'logout' && <span>•</span>}
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="space-y-6">
            {activeSection === 'account' && ( // account info and change password)
              <>
                <div className="bg-white rounded-2xl shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">My Account</h2>
                  <div className="space-y-4">
                    {accountSummaryFields.map((field) => (
                      <div
                        key={field.key}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border-2 border-gray-100"
                      >
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{field.label}</p>
                          <p className="text-lg font-semibold text-gray-800">{accountSummary[field.valueKey]}</p>
                        </div>
                        <button
                          onClick={() => jumpToFormSection(field.targetId)}
                          className="self-start sm:self-auto px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition"
                        >
                          {field.action}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <AccountTab />
              </>
            )}

            {activeSection === 'reviews' && ( //review
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-800">My Reviews</h2>
                  <p className="text-gray-500 mt-1">Manage your ratings and reviews here.</p>
                </div>
                <MyReviewTab />
              </div>
            )}

            {activeSection === 'saved' && <SavedList />}

            {activeSection === 'bookings' && <BookingsList />}

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
