import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { donationAPI, volunteerAPI } from '../../../services/api';
import StatusBadge from '../../../components/StatusBadge';
import Spinner from '../../../components/Spinner';
import DeliveryTracker from '../../../components/DeliveryTracker';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { key: 'donations', icon: '📦', label: 'Donations' },
  { key: 'volunteers', icon: '🙌', label: 'Volunteers' },
];

const STATUS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  DELIVERED: 'Delivered'
};

const AVAILABILITY = {
  AVAILABLE: 'Available',
  BUSY: 'Busy',
  NOT_AVAILABLE: 'Not Available',
};

// Helper to safely get the volunteer's user ID
const getVolunteerUserId = (volunteer) => {
  if (!volunteer) return null;
  if (typeof volunteer.userId === 'object') {
    return volunteer.userId?._id;
  }
  return volunteer.userId;
};

const NgoDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('donations');
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState(null);

  // Selected volunteer for each donation
  const [selectedVolunteers, setSelectedVolunteers] = useState({});

  // Proof of Delivery form state
  const [proofForms, setProofForms] = useState({});

  const fetchDonations = useCallback(async () => {
    try {
      const d = await donationAPI.getAll();
      setDonations(d.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch donations', error);
      setError('Failed to load donations');
      toast.error('Failed to load donations');
    }
  }, []);

  const fetchVolunteers = useCallback(async () => {
    try {
      const v = await volunteerAPI.getAll();
      setVolunteers(v.data);
    } catch (error) {
      console.error('Failed to fetch volunteers', error);
      toast.error('Failed to load volunteers');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchAll = async () => {
      try {
        await Promise.all([fetchDonations(), fetchVolunteers()]);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAll();

    return () => {
      isMounted = false;
    };
  }, [fetchDonations, fetchVolunteers]);

  // Accept / Reject donation
  const handleStatusUpdate = async (id, status) => {
    setUpdating(id + status);

    try {
      const { data } = await donationAPI.updateStatus(id, status);

      setDonations((prev) =>
        prev.map((d) =>
          d._id === id
            ? {
                ...d,
                status: data.donation?.status || data.status,
                acceptedBy: data.donation?.acceptedBy || d.acceptedBy,
              }
            : d
        )
      );

      toast.success(`Donation ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  // Handle volunteer selection
  const handleVolunteerChange = useCallback((donationId, volunteerId) => {
    setSelectedVolunteers((prev) => ({
      ...prev,
      [donationId]: volunteerId,
    }));
  }, []);

  // Assign volunteer to donation
  const handleAssignVolunteer = async (donationId) => {
    const volunteerId = selectedVolunteers[donationId];

    if (!volunteerId) {
      toast.error('Please select a volunteer first');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to assign this volunteer to the donation?'
    );

    if (!confirmed) return;

    try {
      setUpdating(`assign-${donationId}`);

      await donationAPI.assignVolunteer(donationId, volunteerId);

      toast.success('Volunteer assigned successfully');
      await fetchDonations();

      setSelectedVolunteers((prev) => ({
        ...prev,
        [donationId]: '',
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign volunteer');
    } finally {
      setUpdating(null);
    }
  };

  // Unassign volunteer
  const handleUnassignVolunteer = async (donationId) => {
    const confirmed = window.confirm('Are you sure you want to unassign this volunteer?');

    if (!confirmed) return;

    try {
      setUpdating(`unassign-${donationId}`);
      await donationAPI.unassignVolunteer(donationId);
      toast.success('Volunteer unassigned successfully');
      await fetchDonations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unassign volunteer');
    } finally {
      setUpdating(null);
    }
  };

  // Update Proof Form Fields
  const handleProofFieldChange = (donationId, field, value) => {
    setProofForms((prev) => ({
      ...prev,
      [donationId]: {
        ...(prev[donationId] || {}),
        [field]: value
      }
    }));
  };

  // Upload Proof of Delivery
  const handleProofSubmit = async (donationId) => {
    const proof = proofForms[donationId];

    if (!proof?.photoUrl || !proof?.receiverName) {
      toast.error('Photo URL and receiver name are required');
      return;
    }

    try {
      setUpdating(`proof-${donationId}`);

      await donationAPI.uploadProofOfDelivery(donationId, {
        photoUrl: proof.photoUrl,
        receiverName: proof.receiverName,
        message: proof.message || ''
      });

      toast.success('Proof of delivery uploaded successfully');

      setProofForms((prev) => ({
        ...prev,
        [donationId]: {
          photoUrl: '',
          receiverName: '',
          message: ''
        }
      }));

      await fetchDonations();

    } catch (error) {
      console.error('Proof upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload proof');
    } finally {
      setUpdating(null);
    }
  };

  const pending = useMemo(
    () => donations.filter((d) => d.status === STATUS.PENDING).length,
    [donations]
  );

  const accepted = useMemo(
    () => donations.filter((d) => d.status === STATUS.ACCEPTED).length,
    [donations]
  );

  const availableVolunteers = useMemo(() => {
    return volunteers.filter(
      (volunteer) =>
        getVolunteerUserId(volunteer) &&
        (volunteer.availabilityStatus || AVAILABILITY.AVAILABLE) === AVAILABILITY.AVAILABLE
    );
  }, [volunteers]);

  const assignedVolunteerIds = useMemo(() => {
    const ids = new Set();
    donations.forEach((d) => {
      if (d.assignedVolunteer) {
        const volId = getVolunteerUserId(d.assignedVolunteer);
        if (volId) ids.add(volId);
      }
    });
    return ids;
  }, [donations]);

  const assignableVolunteers = useMemo(() => {
    return availableVolunteers.filter(
      (volunteer) => !assignedVolunteerIds.has(getVolunteerUserId(volunteer))
    );
  }, [availableVolunteers, assignedVolunteerIds]);

  if (error && donations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Something went wrong</h3>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex" style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-40 flex flex-col transition-all lg:static lg:z-auto"
        style={{
          width: '240px',
          background: '#1E293B',
          transform: sidebarOpen ? 'translateX(0)' : undefined,
        }}
      >
        <div className="px-6 py-6 border-b" style={{ borderColor: '#334155' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: '#FF6B35' }}>🍱</div>
            <div>
              <p className="font-bold text-white text-sm">ShareBite</p>
              <p className="text-xs" style={{ color: '#94A3B8' }}>NGO Portal</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-b" style={{ borderColor: '#334155' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: '#2EC4B6' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs" style={{ color: '#94A3B8' }}>NGO Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map((item) => (
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
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-6 py-4 flex items-center gap-4" style={{ borderColor: '#E5E7EB' }}>
          <button className="lg:hidden p-2 rounded-lg" style={{ color: '#6B7280' }} onClick={() => setSidebarOpen(true)}>☰</button>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#2D2D2D' }}>
              {activeTab === 'donations' ? 'Donation Requests' : 'Volunteer Network'}
            </h1>
          </div>
        </header>

        <main className="flex-1 p-6">
          {loading ? (
            <Spinner center />
          ) : activeTab === 'donations' ? (
            <div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {donations.map((d) => (
                  <div key={d._id} className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: '#F3F4F6' }}>
                    <div className="flex items-start justify-between mb-4 gap-2">
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

                    {d.status === STATUS.ACCEPTED && d.acceptedBy && (
                      <p style={{ color: 'green', fontWeight: 'bold', marginBottom: '12px', fontSize: '13px' }}>
                        Accepted by {d.acceptedBy.name} ✅
                      </p>
                    )}

                    <DeliveryTracker donation={d} />

                    <div className="space-y-1.5 mb-5 mt-4">
                      <p className="text-sm" style={{ color: '#6B7280' }}>
                        <span className="font-medium" style={{ color: '#2D2D2D' }}>Qty:</span> {d.quantity}
                      </p>
                      <p className="text-sm" style={{ color: '#6B7280' }}>
                        <span className="font-medium" style={{ color: '#2D2D2D' }}>📍</span> {d.address}
                      </p>
                    </div>

                    {/* Pending Action Buttons */}
                    {d.status === STATUS.PENDING && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(d._id, STATUS.ACCEPTED)}
                          disabled={updating === d._id + STATUS.ACCEPTED}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold bg-green-100 text-green-800"
                        >
                          {updating === d._id + STATUS.ACCEPTED ? '...' : '✓ Accept'}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(d._id, STATUS.REJECTED)}
                          disabled={updating === d._id + STATUS.REJECTED}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold bg-red-100 text-red-800"
                        >
                          {updating === d._id + STATUS.REJECTED ? '...' : '✕ Reject'}
                        </button>
                      </div>
                    )}

                    {/* Assign Volunteer Section */}
                    {d.status === STATUS.ACCEPTED && (
                      <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
                        <p className="text-sm font-semibold mb-2" style={{ color: '#2D2D2D' }}>🙌 Assign Volunteer</p>
                        {d.assignedVolunteer ? (
                          <div className="space-y-2">
                            <div className="p-3 rounded-xl bg-blue-50">
                              <p className="text-xs font-semibold text-blue-700">Volunteer Assigned</p>
                              <p className="text-sm text-blue-900">{d.assignedVolunteer.name || 'Volunteer assigned'}</p>
                            </div>
                            <button
                              onClick={() => handleUnassignVolunteer(d._id)}
                              disabled={updating === `unassign-${d._id}`}
                              className="w-full py-2 rounded-xl text-xs font-semibold bg-red-100 text-red-800"
                            >
                              {updating === `unassign-${d._id}` ? 'Unassigning...' : '✕ Unassign'}
                            </button>
                          </div>
                        ) : (
                          <>
                            <select
                              value={selectedVolunteers[d._id] || ''}
                              onChange={(e) => handleVolunteerChange(d._id, e.target.value)}
                              className="w-full border rounded-xl px-3 py-2 text-sm mb-2 outline-none border-gray-300 text-gray-700"
                            >
                              <option value="">Select volunteer</option>
                              {assignableVolunteers.map((volunteer) => (
                                <option key={getVolunteerUserId(volunteer)} value={getVolunteerUserId(volunteer)}>
                                  {volunteer.name}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAssignVolunteer(d._id)}
                              disabled={updating === `assign-${d._id}`}
                              className="w-full py-2 rounded-xl text-xs font-semibold text-white bg-blue-600"
                            >
                              {updating === `assign-${d._id}` ? 'Assigning...' : 'Assign Volunteer'}
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {/* Proof of Delivery UI */}
                    {d.status === STATUS.DELIVERED && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        {d.proofOfDelivery?.photoUrl ? (
                           <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                             <p className="text-sm font-bold text-green-700 flex items-center gap-2">
                               <span>✅</span> Proof Uploaded
                             </p>
                             <p className="text-xs text-green-600 mt-1">Receiver: {d.proofOfDelivery.receiverName}</p>
                             <a 
                               href={d.proofOfDelivery.photoUrl} 
                               target="_blank" 
                               rel="noreferrer"
                               className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                             >
                               View Photo
                             </a>
                           </div>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                              <span>📸</span> Upload Proof of Delivery
                            </p>
                            <input
                              type="text"
                              placeholder="Photo URL (e.g., Imgur/Cloudinary link)"
                              value={proofForms[d._id]?.photoUrl || ''}
                              onChange={(e) => handleProofFieldChange(d._id, 'photoUrl', e.target.value)}
                              className="w-full border rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Receiver Name"
                              value={proofForms[d._id]?.receiverName || ''}
                              onChange={(e) => handleProofFieldChange(d._id, 'receiverName', e.target.value)}
                              className="w-full border rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                            />
                            <textarea
                              placeholder="Message/Notes (Optional)"
                              value={proofForms[d._id]?.message || ''}
                              onChange={(e) => handleProofFieldChange(d._id, 'message', e.target.value)}
                              className="w-full border rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 resize-none"
                              rows="2"
                            />
                            <button
                              onClick={() => handleProofSubmit(d._id)}
                              disabled={updating === `proof-${d._id}`}
                              className="w-full py-2 rounded-lg text-xs font-semibold text-white bg-gray-800 hover:bg-gray-900 transition-colors"
                            >
                              {updating === `proof-${d._id}` ? 'Uploading...' : 'Submit Proof'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {volunteers.map((v) => (
                <div key={v._id} className="bg-white rounded-2xl p-6 border shadow-sm mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold bg-teal-400">
                      {v.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{v.name}</p>
                      <p className="text-xs text-gray-500">Volunteer</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Contact</p>
                      <p className="text-sm text-gray-800">{v.contact || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default NgoDashboard;