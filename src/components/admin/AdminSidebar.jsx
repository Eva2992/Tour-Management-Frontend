const menuItems = [
  { id: 'stats',   icon: '📊', label: 'Statistics' },
  { id: 'tours',   icon: '🗺️', label: 'Manage Tours' },
  { id: 'users',   icon: '👥', label: 'Manage Users' },
  { id: 'reviews', icon: '⭐', label: 'Manage Reviews' },
];

const AdminSidebar = ({ active, onSelect, user }) => {
  return (
    <aside className="w-[260px] flex-shrink-0 self-start bg-white rounded-2xl shadow p-3 lg:sticky lg:top-6">
      <div className="px-3 pb-3 border-b border-gray-100 mb-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
          {user?.name?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-800 truncate">{user?.name || 'Admin'}</p>
          <h3 className="text-xs text-gray-500 truncate">Admin</h3>
        </div>
      </div>

      <p className="px-3 pt-1 text-lg font-extrabold tracking-wide text-gray-400 uppercase">ADMIN DASHBOARD</p>
      <p className="px-3 pb-2 text-xs font-bold tracking-wide text-gray-400 uppercase">Navigation</p>
      <div className="space-y-1">
        {menuItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-teal-400 to-cyan-200 text-white shadow '
                  : 'text-emerald-700 hover:bg-gradient-to-r from-teal-400 to-cyan-200 hover:text-white transition-all'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span className="font-bold">{item.label}</span>
              </span>
              {isActive && <span>•</span>}
            </button>
          );
        })}
      </div>

      <div className="px-2 pt-3 mt-3 border-t border-gray-100">
        <a
          href="/"
          className="block px-4 py-2 rounded-lg text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition"
        >
          ← Back to Site
        </a>
      </div>
    </aside>
  );
};

export default AdminSidebar;