import useTour from '../../hooks/useTour';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';

const fetchUsersCount = async () => {
  const res = await axiosInstance.get('/users');
  return res?.data?.results ?? res?.data?.data?.doc?.length ?? 0;
};

const fetchReviewsCount = async () => {
  const res = await axiosInstance.get('/reviews');
  return res?.data?.results ?? res?.data?.data?.doc?.length ?? 0;
};

const StatCard = ({ icon, label, value, color }) => (
  <div style={{
    background: 'white', borderRadius: 20, padding: '24px 28px',
    boxShadow: '0 4px 16px rgba(14,206,206,0.08)',
    border: '1px solid rgba(163,248,248,0.3)',
    display: 'flex', alignItems: 'center', gap: 18,
  }}>
    <div style={{
      width: 52, height: 52, borderRadius: 16,
      background: color, display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: 24,
    }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 800, color: '#0c4a4a' }}>{value}</p>
    </div>
  </div>
);

const StatsPlaceholder = () => {
  const { data: tours } = useTour();
  const { data: usersCount } = useQuery({
    queryKey: ['admin-users-count'],
    queryFn: fetchUsersCount,
    retry: 1,
  });
  const { data: reviewsCount } = useQuery({
    queryKey: ['admin-reviews-count'],
    queryFn: fetchReviewsCount,
    retry: 1,
  });

  const totalTours = tours?.length || 0;
  const totalUsers = usersCount ?? '—';
  const totalReviews = reviewsCount ?? '—';
  const totalRevenue = '$16,720';

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0c4a4a', fontFamily: "'Playfair Display', serif" }}>
          Dashboard Overview
        </h2>
        <p style={{ color: '#9ca3af', marginTop: 4 }}>Welcome back, Admin</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
        <StatCard icon="🗺️" label="Total Tours"   value={totalTours}   color="rgba(163,248,248,0.3)" />
        <StatCard icon="👥" label="Total Users"   value={totalUsers}   color="rgba(251,191,36,0.2)" />
        <StatCard icon="⭐" label="Total Reviews" value={totalReviews} color="rgba(167,243,208,0.3)" />
        <StatCard icon="💰" label="Revenue"       value={totalRevenue} color="rgba(196,181,253,0.3)" />
      </div>

    </div>
  );
};

export default StatsPlaceholder;