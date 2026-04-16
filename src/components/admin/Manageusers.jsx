import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';
import { buildUserImageUrl } from '../../api/config';

const fetchUsers = async () => {
  const res = await axiosInstance.get('/users');
  return res.data.data.doc;
};

const deleteUser = async (id) => {
  const safeId = encodeURIComponent(id);
  await axiosInstance.delete(`/users/deleteUserbyAdmin/${safeId}`);
};

const updateUser = async ({ id, data }) => {
  const safeId = encodeURIComponent(id);
  const res = await axiosInstance.patch(`/users/updateUserbyAdmin/${safeId}`, data);
  return res?.data?.data?.doc || res?.data?.data?.user || res?.data?.data;
};

const RoleBadge = ({ role }) => {
  const styles = {
    admin:       { bg: 'rgba(163,248,248,0.3)', color: '#0c4a4a' },
    'lead-guide':{ bg: 'rgba(167,243,208,0.4)', color: '#065f46' },
    guide:       { bg: 'rgba(253,230,138,0.4)', color: '#92400e' },
    user:        { bg: '#f3f4f6',               color: '#6b7280' },
  };
  const s = styles[role] || styles.user;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>
      {role}
    </span>
  );
};

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  border: '1.5px solid rgba(163,248,248,0.4)', outline: 'none',
  fontSize: 14, color: '#374151', background: '#f4fefe',
  boxSizing: 'border-box',
};

const ManageUsers = () => {
  const qc = useQueryClient();
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });
  const [formError, setFormError] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');

  const { data: users, isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: fetchUsers });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      setDeleteConfirm(null);
      setStatusMessage({ type: 'success', text: 'User deleted successfully.' });
    },
    onError: () => {
      setStatusMessage({ type: 'error', text: 'Failed to delete user.' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      if (updatedUser?._id) {
        qc.setQueryData(['admin-users'], (oldUsers = []) =>
          oldUsers.map((user) => (user._id === updatedUser._id ? { ...user, ...updatedUser } : user))
        );
      }
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      setFormError('');
      setEditUser(null);
      setStatusMessage({ type: 'success', text: 'User updated successfully.' });
    },
    onError: () => {
      setFormError('Failed to update user.');
      setStatusMessage({ type: 'error', text: 'Failed to update user.' });
    },
  });

  const openEdit = (user) => {
    setFormError('');
    setStatusMessage({ type: '', text: '' });
    setForm({ name: user.name, email: user.email, role: user.role });
    setEditUser(user);
  };

  const handleUpdateUser = () => {
    setFormError('');
    setStatusMessage({ type: '', text: '' });

    if (!form.name?.trim() || !form.email?.trim() || !form.role?.trim()) {
      setFormError('Please fill name, email and role.');
      return;
    }

    updateMutation.mutate({
      id: editUser._id,
      data: {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
      },
    });
  };

  const filtered = (users || []).filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0c4a4a', fontFamily: "'Playfair Display', serif" }}>Manage Users</h2>
          <p style={{ color: '#054047', fontSize: 15, marginTop: 4 }}>{filtered.length} users total</p>
        </div>
      </div>

      {statusMessage.text && (
        <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, fontWeight: 700, fontSize: 13, border: statusMessage.type === 'success' ? '1.5px solid #86efac' : '1.5px solid #fca5a5', background: statusMessage.type === 'success' ? '#f0fdf4' : '#fef2f2', color: statusMessage.type === 'success' ? '#166534' : '#b91c1c' }}>
          {statusMessage.type === 'success' ? '✅' : '⚠️'} {statusMessage.text}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderRadius: 15, padding: '14px 18px', border: '3px solid rgba(36, 105, 129, 0.45)', maxWidth: 520 }}>
        <span>🔍</span>
        <input type="text" placeholder="Search by name or email..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent' }}
        />
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 16px rgba(14,206,206,0.08)', border: '1px solid rgba(163,248,248,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, #f4fefe, #e0fefe)', borderBottom: '2px solid rgba(163,248,248,0.5)' }}>
              {['User', 'Email', 'Role', 'Actions'].map((h, index, arr) => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#0c4a4a', letterSpacing: '0.05em', textTransform: 'uppercase', borderRight: index !== arr.length - 1 ? '1px solid rgba(163,248,248,0.4)' : 'none' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>{[...Array(4)].map((_, j) => (
                  <td key={j} style={{ padding: '14px 16px' }}>
                    <div style={{ height: 16, borderRadius: 8, background: '#f4fefe', width: j === 0 ? 160 : 100 }} />
                  </td>
                ))}</tr>
              ))
            ) : filtered.map(user => (
              <tr key={user._id} style={{ borderTop: '1px solid #f4fefe', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fffe'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {user.photo ? (
                      <img
                        src={buildUserImageUrl(user.photo)}
                        alt={user.name}
                        style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id}`;
                        }}
                      />
                    ) : (
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #A3F8F8, #0ECECE)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 15, color: '#0c4a4a',
                      }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#0c4a4a' }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: 13 }}>{user.email}</td>
                <td style={{ padding: '14px 16px' }}><RoleBadge role={user.role} /></td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(user)} style={{
                      background: '#f4fefe', border: '1px solid rgba(163,248,248,0.5)',
                      color: '#0ECECE', fontWeight: 600, fontSize: 12,
                      padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                    }}>Edit</button>
                    <button onClick={() => setDeleteConfirm(user)} style={{
                      background: '#fff1f1', border: '1px solid #fecaca',
                      color: '#ef4444', fontWeight: 600, fontSize: 12,
                      padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                    }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>No users found</div>
        )}
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 24, padding: 36, width: '100%', maxWidth: 480 }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0c4a4a', marginBottom: 24, fontFamily: "'Playfair Display', serif" }}>Edit User</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[{ label: 'Name', key: 'name' }, { label: 'Email', key: 'email' }].map(({ label, key }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                  <input type="text" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={inputStyle}>
                  <option value="user">User</option>
                  <option value="guide">Guide</option>
                  <option value="lead-guide">Lead Guide</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            {formError && (
              <p style={{ color: '#dc2626', fontWeight: 700, fontSize: 13, marginTop: 14, marginBottom: 0 }}>
                ⚠️ {formError}
              </p>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => { setEditUser(null); setFormError(''); }} style={{ flex: 1, padding: 12, borderRadius: 12, border: '1.5px solid #e5e7eb', background: 'white', color: '#6b7280', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleUpdateUser} disabled={updateMutation.isPending}
                style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #A3F8F8, #0ECECE)', color: '#0c4a4a', fontWeight: 700, cursor: 'pointer' }}>
                {updateMutation.isPending ? 'Saving...' : 'Update User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 24, padding: 36, maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>⚠️</p>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0c4a4a', marginBottom: 8 }}>Delete User?</h3>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>Delete <strong>"{deleteConfirm.name}"</strong>? This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: 12, borderRadius: 12, border: '1.5px solid #e5e7eb', background: 'white', color: '#6b7280', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => deleteMutation.mutate(deleteConfirm._id)} disabled={deleteMutation.isPending}
                style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: '#ef4444', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;