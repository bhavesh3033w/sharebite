import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { donationAPI, volunteerAPI } from '../../../services/api';
import StatusBadge from '../../../components/StatusBadge';
import Spinner from '../../../components/Spinner';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { key: 'donations', icon: '📦', label: 'Donations' },
  { key: 'volunteers', icon: '🙌', label: 'Volunteers' },
];

const NgoDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('donations');
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [d, v] = await Promise.all([donationAPI.getAll(), volunteerAPI.getAll()]);
        setDonations(d.data);
        setVolunteers(v.data);
      } catch {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setUpdating(id + status);
    try {
      const { data } = await donationAPI.updateStatus(id, status);
      setDonations(prev => prev.map(d => d._id === id ? { ...d, status: data.status } : d));
      toast.success(`Donation ${status.toLowerCase()} successfully`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const pending = donations.filter(d => d.status === 'Pending').length;
  const accepted = donations.filter(d => d.status === 'Accepted').length;

  return (
    <div className="flex" style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-40 flex flex-col transition-all lg:static lg:z-auto"
        style={{ width: '240px', background: '#1E293B', transform: sidebarOpen ? 'translateX(0)' : undefined }}
      >
        {/* Sidebar header */}
        <div className="px-6 py-6 border-b" style={{ borderColor: '#334155' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: '#FF6B35' }}>🍱</div>
            <div>
              <p className="font-bold text-white text-sm">ShareBite</p>
              <p className="text-xs" style={{ color: '#94A3B8' }}>NGO Portal</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b" style={{ borderColor: '#334155' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: '#2EC4B6' }}>
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs" style={{ color: '#94A3B8' }}>NGO Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left"
              style={{
                background: activeTab === item.key ? '#FF6B35' : 'transparent',
                color: activeTab === item.key ? '#FFFFFF' : '#94A3B8',
              }}
            >
              <span>{item.icon}</span>
              {item.label}
              {item.key === 'donations' && pending > 0 && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: '#FACC15', color: '#854D0E' }}>
                  {pending}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-6 py-4">
          <div className="rounded-xl p-4" style={{ background: '#334155' }}>
            <p className="text-xs text-white font-semibold mb-1">Quick Stats</p>
            <p className="text-xs" style={{ color: '#94A3B8' }}>{accepted} accepted · {pending} pending</p>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b px-6 py-4 flex items-center gap-4" style={{ borderColor: '#E5E7EB' }}>
          <button className="lg:hidden p-2 rounded-lg" style={{ color: '#6B7280' }} onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#2D2D2D' }}>
              {activeTab === 'donations' ? 'Donation Requests' : 'Volunteer Network'}
            </h1>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              {activeTab === 'donations'
                ? `${donations.length} total requests`
                : `${volunteers.length} registered volunteers`}
            </p>
          </div>
          {/* Banner image */}
          <div className="ml-auto hidden md:block">
            <div className="rounded-xl overflow-hidden" style={{ width: '160px', height: '52px' }}>
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=320&q=60"
                alt="NGO work"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {loading ? (
            <Spinner center />
          ) : activeTab === 'donations' ? (
            <div>
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total', val: donations.length, bg: '#F1F5F9', color: '#1E293B' },
                  { label: 'Pending', val: pending, bg: '#FEFCE8', color: '#854D0E' },
                  { label: 'Accepted', val: accepted, bg: '#F0FDF4', color: '#14532D' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-4" style={{ background: s.bg }}>
                    <p className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</p>
                    <p className="text-xs" style={{ color: '#6B7280' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {donations.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center">
                  <div className="text-5xl mb-4">📭</div>
                  <h3 className="text-lg font-bold" style={{ color: '#2D2D2D' }}>No donations yet</h3>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {donations.map(d => (
                    <div key={d._id} className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: '#F3F4F6' }}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#F8FAFC' }}>
                            {d.type === 'Food' ? '🍱' : '👕'}
                          </div>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: '#2D2D2D' }}>{d.type}</p>
                            <p className="text-xs" style={{ color: '#6B7280' }}>
                              {d.donorName || d.userId?.name || 'Anonymous'}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={d.status} />
                      </div>

                      <div className="space-y-1.5 mb-5">
                        <p className="text-sm" style={{ color: '#6B7280' }}>
                          <span className="font-medium" style={{ color: '#2D2D2D' }}>Qty:</span> {d.quantity}
                        </p>
                        <p className="text-sm" style={{ color: '#6B7280' }}>
                          <span className="font-medium" style={{ color: '#2D2D2D' }}>📍</span> {d.address}
                        </p>
                        <p className="text-xs" style={{ color: '#9CA3AF' }}>
                          {new Date(d.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>

                      {d.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusUpdate(d._id, 'Accepted')}
                            disabled={updating === d._id + 'Accepted'}
                            className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                            style={{ background: '#DCFCE7', color: '#14532D' }}
                            onMouseEnter={e => e.target.style.background = '#BBF7D0'}
                            onMouseLeave={e => e.target.style.background = '#DCFCE7'}
                          >
                            {updating === d._id + 'Accepted' ? '...' : '✓ Accept'}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(d._id, 'Rejected')}
                            disabled={updating === d._id + 'Rejected'}
                            className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                            style={{ background: '#FEE2E2', color: '#7F1D1D' }}
                            onMouseEnter={e => e.target.style.background = '#FECACA'}
                            onMouseLeave={e => e.target.style.background = '#FEE2E2'}
                          >
                            {updating === d._id + 'Rejected' ? '...' : '✕ Reject'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Volunteers tab
            <div>
              {volunteers.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center">
                  <div className="text-5xl mb-4">🙌</div>
                  <h3 className="text-lg font-bold" style={{ color: '#2D2D2D' }}>No volunteers registered yet</h3>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {volunteers.map(v => (
                    <div key={v._id} className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: '#F3F4F6' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ background: '#2EC4B6' }}
                        >
                          {v.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: '#2D2D2D' }}>{v.name}</p>
                          <p className="text-xs" style={{ color: '#6B7280' }}>Volunteer</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Skills</p>
                          <p className="text-sm" style={{ color: '#2D2D2D' }}>{v.skills}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Contact</p>
                          <p className="text-sm" style={{ color: '#2D2D2D' }}>{v.contact}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default NgoDashboard;
