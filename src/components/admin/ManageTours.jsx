import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';


const fetchTours = async () => { // hooks all
  const res = await axiosInstance.get('/tours');  //{{URL}}/api/v1/tours
  return res.data.data.doc;
};

const deleteTour = async (id) => {
  await axiosInstance.delete(`/tours/${id}`); //{{URL}}/api/v1/tours/:id
};

const createTour = async (data) => {
  const res = await axiosInstance.post('/tours', data); //{{URL}}/api/v1/tours
  return res.data.data.doc;
};

const updateTour = async ({ id, data }) => {
  const res = await axiosInstance.patch(`/tours/${id}`, data); //{{URL}}/api/v1/tours/:id
  return res.data.data.doc;
};


const Badge = ({ difficulty }) => {
  const styles = {
    easy:      { bg: '#dcfce7', color: '#166534' },
    medium:    { bg: '#fef9c3', color: '#854d0e' },
    difficult: { bg: '#fee2e2', color: '#991b1b' },
  };
  const s = styles[difficulty] || styles.easy;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>
      {difficulty}
    </span>
  );
};

const emptyForm = { name: '', price: '', Photo: '', difficulty: 'easy', duration: '', maxGroupSize: '', summary: '', description: '' };


const ManageTours = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editTour, setEditTour] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');

  const { data: tours, isLoading } = useQuery({ queryKey: ['admin-tours'], queryFn: fetchTours });

  const deleteMutation = useMutation({
    mutationFn: deleteTour,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-tours'] });
      setDeleteConfirm(null);
      setStatusMessage({ type: 'success', text: 'Tour deleted successfully.' });
    },
    onError: () => {
      setStatusMessage({ type: 'error', text: 'Failed to delete tour.' });
    },
  });

  const createMutation = useMutation({
    mutationFn: createTour,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-tours'] });
      closeForm();
      setStatusMessage({ type: 'success', text: 'Tour created successfully.' });
    },
    onError: () => {
      setFormError('Failed to create tour.');
      setStatusMessage({ type: 'error', text: 'Failed to create tour.' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTour,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-tours'] });
      closeForm();
      setStatusMessage({ type: 'success', text: 'Tour updated successfully.' });
    },
    onError: () => {
      setFormError('Failed to update tour.');
      setStatusMessage({ type: 'error', text: 'Failed to update tour.' });
    },
  });

  const openCreate = () => {
    setFormError('');
    setStatusMessage({ type: '', text: '' });
    setForm(emptyForm);
    setEditTour(null);
    setShowForm(true);
  };
  const openEdit = (tour) => {
    setFormError('');
    setStatusMessage({ type: '', text: '' });
    setForm({
      name: tour.name, price: tour.price,
      Photo : tour.imageCover,
      difficulty: tour.difficulty, duration: tour.duration,
      maxGroupSize: tour.maxGroupSize, summary: tour.summary || '', description: tour.description || '',
    });
    setEditTour(tour);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditTour(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSubmit = () => {
    setFormError('');
    const requiredFields = ['name', 'price', 'Photo', 'difficulty', 'duration', 'maxGroupSize', 'summary', 'description'];
    const missingField = requiredFields.find((field) => !String(form[field] ?? '').trim());
    if (missingField) {
      setFormError(`Please fill the ${missingField} field.`);
      return;
    }

    const { Photo, ...restForm } = form;
    const payload = {
      ...restForm,
      imageCover: Photo,
      price: Number(restForm.price),
      duration: Number(restForm.duration),
      maxGroupSize: Number(restForm.maxGroupSize),
      startLocation: {
        type: 'Point',
      },
      locations: [],
      startDates: [],
    };

    if (editTour) updateMutation.mutate({ id: editTour._id, data: payload });
    else createMutation.mutate(payload);
  };

  const filtered = (tours || []).filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1.5px solid rgba(163,248,248,0.4)', outline: 'none',
    fontSize: 14, color: '#374151', background: '#f4fefe',
    boxSizing: 'border-box',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#09b4c0', fontFamily: "'Playfair Display', serif" }}>Manage Tours</h2>
          <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>{filtered.length} tours total</p>
        </div>
        <button onClick={openCreate} style={{
          background: 'linear-gradient(135deg, #A3F8F8, #0ECECE)',
          color: '#0c4a4a', fontWeight: 700, fontSize: 14,
          padding: '10px 24px', borderRadius: 12, border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(14,206,206,0.3)',
        }}>
          + Add New Tour
        </button>
      </div>

      {statusMessage.text && (
        <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, fontWeight: 700, fontSize: 13, border: statusMessage.type === 'success' ? '1.5px solid #86efac' : '1.5px solid #fca5a5', background: statusMessage.type === 'success' ? '#f0fdf4' : '#fef2f2', color: statusMessage.type === 'success' ? '#166534' : '#b91c1c' }}>
          {statusMessage.type === 'success' ? '✅' : '⚠️'} {statusMessage.text}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderRadius: 15, padding: '14px 18px', border: '2px solid rgba(28, 149, 155, 0.45)', maxWidth: 520 }}>
        <span>🔍</span>
        <input
          type="text" placeholder="Search tours..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent' }}
        />
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 16px rgba(14,206,206,0.08)', border: '1px solid rgba(163,248,248,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, #f4fefe, #e0fefe)', borderBottom: '2px solid rgba(163,248,248,0.5)' }}>
              {['Tour Name', 'Price', 'Difficulty', 'Duration', 'Rating', 'Max Group', 'Actions'].map((h, index, arr) => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#0c4a4a', letterSpacing: '0.05em', textTransform: 'uppercase', borderRight: index !== arr.length - 1 ? '1px solid rgba(163,248,248,0.4)' : 'none' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => (
                    <td key={j} style={{ padding: '14px 16px' }}>
                      <div style={{ height: 16, borderRadius: 8, background: '#f4fefe', width: j === 0 ? 160 : 60 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.map((tour) => (
              <tr key={tour._id} style={{ borderTop: '1px solid #f4fefe', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fffe'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img
                      src={`http://localhost:3000/img/tours/${tour.imageCover}`}
                      style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#0c4a4a' }}>{tour.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0ECECE' }}>${tour.price}</td>
                <td style={{ padding: '14px 16px' }}><Badge difficulty={tour.difficulty} /></td>
                <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: 13 }}>{tour.duration} days</td>
                <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: 13 }}>⭐ {tour.ratingsAverage}</td>
                <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: 13 }}>{tour.maxGroupSize}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(tour)} style={{
                      background: '#f4fefe', border: '1px solid rgba(163,248,248,0.5)',
                      color: '#0ECECE', fontWeight: 600, fontSize: 12,
                      padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                    }}>Edit</button>
                    <button onClick={() => setDeleteConfirm(tour)} style={{
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
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
            No tours found
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, overflowY: 'auto' }}>
          <div style={{ background: 'white', borderRadius: 24, padding: 36, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0c4a4a', marginBottom: 24, fontFamily: "'Playfair Display', serif" }}>
              {editTour ? 'Edit Tour' : 'Create New Tour'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Tour Name', key: 'name', type: 'text' },
                { label: 'Price ($)', key: 'price', type: 'number' },
                { label: 'Photo', key: 'Photo', type: 'text' },
                { label: 'Duration (days)', key: 'duration', type: 'number' },
                { label: 'Max Group Size', key: 'maxGroupSize', type: 'number' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                  <input
                    type={type} value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              ))}

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Difficulty</label>
                <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} style={inputStyle}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="difficult">Difficult</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Summary</label>
                <textarea value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                  rows={3} style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4} style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              {formError && (
                <p style={{ width: '100%', margin: 0, marginBottom: 8, color: '#dc2626', fontWeight: 700, fontSize: 13 }}>
                  ⚠️ {formError}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <button onClick={closeForm} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid #e5e7eb', background: 'white', color: '#6b7280', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #A3F8F8, #0ECECE)', color: '#0c4a4a', fontWeight: 700, cursor: 'pointer' }}
              >
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editTour ? 'Update Tour' : 'Create Tour'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, overflowY: 'auto' }}>
          <div style={{ background: 'white', borderRadius: 24, padding: 36, maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🗑️</p>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0c4a4a', marginBottom: 8 }}>Delete Tour?</h3>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>
              Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: 12, borderRadius: 12, border: '1.5px solid #e5e7eb', background: 'white', color: '#6b7280', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirm._id)}
                disabled={deleteMutation.isPending}
                style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: '#ef4444', color: 'white', fontWeight: 700, cursor: 'pointer' }}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTours;