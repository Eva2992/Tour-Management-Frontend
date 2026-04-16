import useTour from '../../hooks/useTour';

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
        <StatCard icon="🗺️" label="Total Tours"    value={tours?.length || '—'}  color="rgba(163,248,248,0.3)" />
        <StatCard icon="👥" label="Total Users"    value="—"                      color="rgba(251,191,36,0.2)"  />
        <StatCard icon="⭐" label="Total Reviews"  value="—"                      color="rgba(167,243,208,0.3)" />
        <StatCard icon="💰" label="Revenue"        value="Coming Soon"            color="rgba(196,181,253,0.3)" />
      </div>

      {/* Coming soon banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0c3333, #0a5a5a)',
        borderRadius: 20, padding: '40px',
        textAlign: 'center', color: 'white',
      }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>📊</p>
        <h3 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Playfair Display', serif", marginBottom: 8 }}>
          Detailed Statistics Coming Soon
        </h3>
        <p style={{ color: 'rgba(163,248,248,0.6)', fontSize: 14 }}>
          Charts, revenue analytics, and booking trends will be available here.
        </p>
      </div>
    </div>
  );
};

export default StatsPlaceholder;