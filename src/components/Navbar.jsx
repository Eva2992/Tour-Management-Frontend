import { useState } from 'react';

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b-4 border-emerald-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-emerald-600">🌍 Book Your Trip</h1>
          </div>

          {/* Center - Empty */}
          <div className="flex-1"></div>

          {/* Right - Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold flex items-center justify-center hover:shadow-lg transition-shadow border-2 border-white"
             
              title="Profile"
            >
              <h3>👤</h3>
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border-2 border-emerald-200 overflow-hidden z-50">
                <button
                  onClick={() => {
                    alert('🔐 Login page coming soon!');
                    setProfileOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-emerald-50 text-gray-700 font-semibold transition-colors border-b border-emerald-100"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    alert('✍️ Sign Up page coming soon!');
                    setProfileOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-emerald-50 text-gray-700 font-semibold transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
