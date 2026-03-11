const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section - Special Offers */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Offer 1 */}
          <div className="bg-gradient-to-br from-red-600 to-pink-600 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-sm text-red-100 mb-2">🎉 LIMITED TIME</p>
            <h3 className="text-2xl font-bold mb-3">First Trip</h3>
            <div className="flex justify-center items-center gap-2">
              <span className="text-3xl line-through opacity-70">$100</span>
              <span className="text-4xl font-bold">$90</span>
            </div>
            <p className="text-xs mt-3 text-red-100">Use code: FIRST10</p>
            <button
              onClick={() => alert('💳 Redeem: FIRST10')}
              className="mt-4 w-full bg-white text-red-600 font-bold py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Redeem Now
            </button>
          </div>

          {/* Offer 2 */}
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-sm text-yellow-100 mb-2">⭐ MEMBER EXCLUSIVE</p>
            <h3 className="text-2xl font-bold mb-3">Bundle Deal</h3>
            <div className="flex justify-center items-center gap-2">
              <span className="text-3xl line-through opacity-70">$300</span>
              <span className="text-4xl font-bold">$249</span>
            </div>
            <p className="text-xs mt-3 text-yellow-100">Book 2+ tours</p>
            <button
              onClick={() => alert('🎁 Bundle offer applied!')}
              className="mt-4 w-full bg-white text-orange-600 font-bold py-2 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Browse Bundles
            </button>
          </div>

          {/* Offer 3 */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-sm text-purple-100 mb-2">💎 VIP MEMBER</p>
            <h3 className="text-2xl font-bold mb-3">Premium Tours</h3>
            <div className="flex justify-center items-center gap-2">
              <span className="text-3xl line-through opacity-70">$500</span>
              <span className="text-4xl font-bold">$399</span>
            </div>
            <p className="text-xs mt-3 text-purple-100">Guided experiences</p>
            <button
              onClick={() => alert('👑 VIP access activated!')}
              className="mt-4 w-full bg-white text-purple-600 font-bold py-2 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Upgrade to VIP
            </button>
          </div>
        </div>

        <div className="border-t-2 border-emerald-700 pt-12">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h4 className="text-2xl font-bold mb-4">🌍 Natours</h4>
              <p className="text-emerald-100 text-sm mb-4">
                Discover the world's most amazing tours and create unforgettable memories.
              </p>
              <div className="flex gap-3">
                <a href="#" className="bg-emerald-600 hover:bg-emerald-500 p-2 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="bg-emerald-600 hover:bg-emerald-500 p-2 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7"/>
                  </svg>
                </a>
                <a href="#" className="bg-emerald-600 hover:bg-emerald-500 p-2 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path fill="rgb(15, 23, 42)" d="M16.6915026,12.4744748 L16.1624272,15.0151496 L13.5142872,15.0151496 L13.5142872,24 L10.5772331,24 L10.5772331,15.0151496 L8.60297029,15.0151496 L8.60297029,12.4744748 L10.5772331,12.4744748 L10.5772331,11.1589002 C10.5772331,9.56121603 11.2919199,7.5 14.1656164,7.5 C15.5,7.5 16.6623916,7.68225703 16.6623916,7.68225703 L16.6623916,9.92640692 C16.6623916,9.92640692 15.3506526,9.900432 14.0048844,9.900432 C12.4141844,9.900432 12.0151496,10.6565159 12.0151496,11.1589002 L12.0151496,12.4744748 Z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="font-bold mb-4 text-lg">Quick Links</h5>
              <ul className="space-y-2 text-emerald-100 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">🏠 Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">🎫 Tours</a></li>
                <li><a href="#" className="hover:text-white transition-colors">🎁 Deals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">👥 About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">✉️ Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h5 className="font-bold mb-4 text-lg">Support</h5>
              <ul className="space-y-2 text-emerald-100 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">❓ FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">📞 Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">🔒 Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">⚖️ Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">🗺️ Sitemap</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h5 className="font-bold mb-4 text-lg">Get in Touch</h5>
              <ul className="space-y-2 text-emerald-100 text-sm">
                <li>📧 info@natours.com</li>
                <li>📞 +1 (555) 123-4567</li>
                <li>📍 123 Adventure St, NY 10001</li>
                <li className="mt-4 pt-4 border-t border-emerald-700">
                  <button
                    onClick={() => alert('✉️ Newsletter signup!')}
                    className="text-emerald-300 hover:text-white transition-colors"
                  >
                    Subscribe to our newsletter →
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-emerald-700 pt-8 mt-8 flex justify-between items-center flex-wrap gap-4 text-emerald-200 text-sm">
            <p>&copy; 2026 Natours. All rights reserved. | Made with ❤️ by Adventure Seekers</p>
            <div className="flex gap-4">
              <span>🌐 English</span>
              <span>💵 USD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
