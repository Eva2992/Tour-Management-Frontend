import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';
import { buildUserImageUrl } from '../../api/config';

const fetchReviews = async () => {
  const res = await axiosInstance.get('/reviews');
  return res.data.data.doc;
};

const deleteReview = async (id) => {
  await axiosInstance.delete(`/reviews/${id}`);
};

const updateReview = async ({ id, data }) => {
  const res = await axiosInstance.patch(`/reviews/${id}`, data);
  return res.data.data.doc;
};

const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} style={{ color: i <= rating ? '#fbbf24' : '#e5e7eb', fontSize: 14 }}>★</span>
    ))}
  </div>
);

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  border: '1.5px solid rgba(163,248,248,0.4)', outline: 'none',
  fontSize: 14, color: '#374151', background: '#f4fefe',
  boxSizing: 'border-box',
};

const ManageReviews = () => {
  const qc = useQueryClient();
  const [editReview, setEditReview] = useState(null);
  const [form, setForm] = useState({ review: '', rating: 5 });
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');

  const { data: reviews, isLoading } = useQuery({ queryKey: ['admin-reviews'], queryFn: fetchReviews });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-reviews'] });
      setDeleteConfirm(null);
      setStatusMessage({ type: 'success', text: 'Review deleted successfully.' });
    },
    onError: () => {
      setStatusMessage({ type: 'error', text: 'Failed to delete review.' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-reviews'] });
      setEditReview(null);
      setStatusMessage({ type: 'success', text: 'Review updated successfully.' });
    },
    onError: () => {
      setStatusMessage({ type: 'error', text: 'Failed to update review.' });
    },
  });

  const openEdit = (review) => {
    setStatusMessage({ type: '', text: '' });
    setForm({ review: review.review, rating: review.rating });
    setEditReview(review);
  };

  const getReviewUser = (review) => review.referenceUser || review.user || null;

  const filtered = (reviews || []).filter(r =>
    r.review?.toLowerCase().includes(search.toLowerCase()) ||
    getReviewUser(r)?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0c4a4a', fontFamily: "'Playfair Display', serif" }}>Manage Reviews</h2>
          <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>{filtered.length} reviews total</p>
        </div>
      </div>

      {statusMessage.text && (
        <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, fontWeight: 700, fontSize: 13, border: statusMessage.type === 'success' ? '1.5px solid #86efac' : '1.5px solid #fca5a5', background: statusMessage.type === 'success' ? '#f0fdf4' : '#fef2f2', color: statusMessage.type === 'success' ? '#166534' : '#b91c1c' }}>
          {statusMessage.type === 'success' ? '✅' : '⚠️'} {statusMessage.text}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderRadius: 15, padding: '14px 18px', border: '2px solid rgba(23, 158, 158, 0.45)', maxWidth: 520 }}>
        <span>🔍</span>
        <input type="text" placeholder="Search reviews..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent' }}
        />
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 16px rgba(14,206,206,0.08)', border: '1px solid rgba(163,248,248,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, #f4fefe, #e0fefe)', borderBottom: '2px solid rgba(163,248,248,0.5)' }}>
              {['User', 'Review', 'Rating', 'Tour', 'Actions'].map((h, index, arr) => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#0c4a4a', letterSpacing: '0.05em', textTransform: 'uppercase', borderRight: index !== arr.length - 1 ? '1px solid rgba(163,248,248,0.4)' : 'none' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>{[...Array(5)].map((_, j) => (
                  <td key={j} style={{ padding: '14px 16px' }}>
                    <div style={{ height: 16, borderRadius: 8, background: '#f4fefe', width: j === 1 ? 200 : 80 }} />
                  </td>
                ))}</tr>
              ))
            ) : filtered.map(review => (
              <tr key={review._id} style={{ borderTop: '1px solid #f4fefe', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fffe'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {getReviewUser(review)?.photo ? (
                      <img
                        src={buildUserImageUrl(getReviewUser(review).photo)}
                        alt={getReviewUser(review)?.name || 'User'}
                        style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${review._id}`;
                        }}
                      />
                    ) : (
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #A3F8F8, #0ECECE)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 13, color: '#0c4a4a',
                      }}>
                        {getReviewUser(review)?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#0c4a4a' }}>
                      {getReviewUser(review)?.name || 'Unknown'}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', maxWidth: 250 }}>
                  <p style={{ fontSize: 13, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {review.review}
                  </p>
                </td>
                <td style={{ padding: '14px 16px' }}><StarRating rating={review.rating} /></td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#0ECECE', fontWeight: 600 }}>
                  {review.referenceTour?.name || '—'}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(review)} style={{
                      background: '#f4fefe', border: '1px solid rgba(163,248,248,0.5)',
                      color: '#0ECECE', fontWeight: 600, fontSize: 12,
                      padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                    }}>Edit</button>
                    <button onClick={() => setDeleteConfirm(review)} style={{
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
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>No reviews found</div>
        )}
      </div>

      {/* Edit Modal */}
      {editReview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 24, padding: 36, width: '100%', maxWidth: 480 }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0c4a4a', marginBottom: 24, fontFamily: "'Playfair Display', serif" }}>Edit Review</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Review Text</label>
                <textarea value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
                  rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating (1-5)</label>
                <select value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))} style={inputStyle}>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} ★</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setEditReview(null)} style={{ flex: 1, padding: 12, borderRadius: 12, border: '1.5px solid #e5e7eb', background: 'white', color: '#6b7280', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => updateMutation.mutate({ id: editReview._id, data: form })} disabled={updateMutation.isPending}
                style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #A3F8F8, #0ECECE)', color: '#0c4a4a', fontWeight: 700, cursor: 'pointer' }}>
                {updateMutation.isPending ? 'Saving...' : 'Update Review'}
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
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0c4a4a', marginBottom: 8 }}>Delete Review?</h3>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>This review will be permanently deleted.</p>
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

export default ManageReviews;