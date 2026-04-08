import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { donationAPI } from '../../../services/api';
import StatusBadge from '../../../components/StatusBadge';
import Spinner from '../../../components/Spinner';
import toast from 'react-hot-toast';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'Food', quantity: '', address: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchDonations = async () => {
    try {
      const { data } = await donationAPI.getAll();
      setDonations(data);
    } catch {
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonations(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await donationAPI.create(form);
      toast.success('Donation posted successfully! 🎉');
      setForm({ type: 'Food', quantity: '', address: '' });
      setShowForm(false);
      fetchDonations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post donation');
    } finally {
      setSubmitting(false);
    }
  };

  const total = donations.length;
  const accepted = donations.filter(d => d.status === 'Accepted').length;

  return (
    <div style={{ background: '#FFF7F2', minHeight: '100vh' }}>
      {/* Header banner */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FF6B35, #E55A25)' }}>
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=60" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: '#FFD7C7' }}>Donor Dashboard</p>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="mt-1" style={{ color: '#FFD7C7' }}>Your generosity is feeding communities.</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="self-start sm:self-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg"
              style={{ background: '#FFFFFF', color: '#FF6B35' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {showForm ? '✕ Cancel' : '+ Donate Now'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Donations', value: total, icon: '📦', color: '#FFF7F2', border: '#FFD7C7' },
            { label: 'Accepted', value: accepted, icon: '✅', color: '#F0FDF4', border: '#86EFAC' },
            { label: 'Pending', value: donations.filter(d => d.status === 'Pending').length, icon: '⏳', color: '#FEFCE8', border: '#FDE047' },
            { label: 'Rejected', value: donations.filter(d => d.status === 'Rejected').length, icon: '❌', color: '#FEF2F2', border: '#FECACA' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 border" style={{ background: s.color, borderColor: s.border }}>
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-2xl font-bold" style={{ color: '#2D2D2D' }}>{s.value}</p>
              <p className="text-sm" style={{ color: '#6B7280' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Donation Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border" style={{ borderColor: '#FFE8DE' }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: '#2D2D2D' }}>Post a New Donation</h2>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D2D' }}>Donation Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border outline-none text-sm"
                  style={{ borderColor: '#E5E7EB' }}
                >
                  <option value="Food">🍱 Food</option>
                  <option value="Clothes">👕 Clothes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D2D' }}>Quantity</label>
                <input
                  type="text" required
                  value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                  placeholder="e.g. 10 kg rice, 5 boxes meals"
                  className="w-full px-4 py-3 rounded-xl border outline-none text-sm"
                  style={{ borderColor: '#E5E7EB' }}
                  onFocus={e => e.target.style.borderColor = '#FF6B35'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: '#2D2D2D' }}>Pickup Address</label>
                <textarea
                  required rows={3}
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Enter your full pickup address"
                  className="w-full px-4 py-3 rounded-xl border outline-none text-sm resize-none"
                  style={{ borderColor: '#E5E7EB' }}
                  onFocus={e => e.target.style.borderColor = '#FF6B35'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit" disabled={submitting}
                  className="px-8 py-3 rounded-xl text-white font-semibold text-sm flex items-center gap-2"
                  style={{ background: submitting ? '#FFA07A' : '#FF6B35' }}
                >
                  {submitting ? <><Spinner size="sm" /> Posting...</> : 'Submit Donation'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Donation History */}
        <div>
          <h2 className="text-xl font-bold mb-5" style={{ color: '#2D2D2D' }}>Donation History</h2>
          {loading ? (
            <Spinner center />
          ) : donations.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border" style={{ borderColor: '#FFE8DE' }}>
              <div className="text-6xl mb-4">🍱</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2D2D2D' }}>No donations yet</h3>
              <p style={{ color: '#6B7280' }}>Click "Donate Now" to make your first donation!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {donations.map(d => (
                <div
                  key={d._id}
                  className="bg-white rounded-2xl p-6 border transition-all shadow-sm"
                  style={{ borderColor: '#F3F4F6' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#FFF7F2' }}>
                        {d.type === 'Food' ? '🍱' : '👕'}
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: '#2D2D2D' }}>{d.type}</p>
                        <p className="text-xs" style={{ color: '#6B7280' }}>
                          {new Date(d.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={d.status} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span style={{ color: '#6B7280' }}>Qty:</span>
                      <span className="font-medium" style={{ color: '#2D2D2D' }}>{d.quantity}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <span style={{ color: '#6B7280' }}>📍</span>
                      <span style={{ color: '#2D2D2D' }}>{d.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
