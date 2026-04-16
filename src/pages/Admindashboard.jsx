import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import AdminSidebar from '../components/admin/AdminSidebar';
import StatsPlaceholder from '../components/admin/Statsplaceholder';
import ManageTours from '../components/admin/ManageTours';
import ManageUsers from '../components/admin/Manageusers';
import ManageReviews from '../components/admin/ManageReviews';

const AdminDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [active, setActive] = useState('stats');

  // Show loading spinner while auth loads
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4fefe' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '4px solid rgba(163,248,248,0.3)',
          borderTop: '4px solid #0ECECE',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px',
        }} />
        <p style={{ color: '#0ECECE', fontWeight: 600 }}>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  // Redirect non-admins
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const renderContent = () => {
    switch (active) {
      case 'stats':   return <StatsPlaceholder />;
      case 'tours':   return <ManageTours />;
      case 'users':   return <ManageUsers />;
      case 'reviews': return <ManageReviews />;
      default:        return <StatsPlaceholder />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4fefe', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <AdminSidebar active={active} onSelect={setActive} user={user} />

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Top bar */}
        <div style={{
          background: 'white', padding: '16px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(163,248,248,0.3)',
          boxShadow: '0 2px 8px rgba(14,206,206,0.06)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#0c4a4a' }}>Admin</span>
            <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#6b7280' }}>Welcome back,</span>
            <span style={{ fontWeight: 700, color: '#0c4a4a' }}>{user.name}</span>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #A3F8F8, #0ECECE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14, color: '#0c4a4a',
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: '36px 32px' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;