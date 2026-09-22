import React, { useState, useEffect } from 'react';

import { useAuth } from '../../../context/AuthContext';
import { donationAPI } from '../../../services/api';

import StatusBadge from '../../../components/StatusBadge';
import Spinner from '../../../components/Spinner';
import DeliveryTracker from '../../../components/DeliveryTracker';

import toast from 'react-hot-toast';

const trackingStatuses = [
  'Volunteer Assigned',
  'Pickup Started',
  'Picked Up',
  'Out for Delivery',
  'Delivered',
];

const DonorDashboard = () => {
  const { user } = useAuth();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    type: 'Food',
    quantity: '',
    address: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // Fetch donor donations
  const fetchDonations = async () => {
    try {
      const { data } = await donationAPI.getAll();
      setDonations(data);
    } catch (error) {
      console.error('Failed to load donations:', error);
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // Submit donation
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      await donationAPI.create(form);

      toast.success('Donation posted successfully! 🎉');

      setForm({
        type: 'Food',
        quantity: '',
        address: '',
      });

      setShowForm(false);

      fetchDonations();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'Failed to post donation'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const total = donations.length;

  // Case-insensitive stats calculation
  const accepted = donations.filter(
    (d) => d.status?.toLowerCase() === 'accepted'
  ).length;

  const pending = donations.filter(
    (d) => d.status?.toLowerCase() === 'pending'
  ).length;

  const rejected = donations.filter(
    (d) => d.status?.toLowerCase() === 'rejected'
  ).length;

  return (
    <div
      style={{
        background: '#FFF7F2',
        minHeight: '100vh',
      }}
    >
      {/* Header Banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #FF6B35, #E55A25)',
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=60"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p
                className="text-sm font-medium mb-1"
                style={{ color: '#FFD7C7' }}
              >
                Donor Dashboard
              </p>

              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                Welcome back, {user?.name}! 👋
              </h1>

              <p
                className="mt-1"
                style={{ color: '#FFD7C7' }}
              >
                Your generosity is feeding communities.
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="self-start sm:self-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg"
              style={{
                background: '#FFFFFF',
                color: '#FF6B35',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = 'translateY(-2px)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = 'translateY(0)')
              }
            >
              {showForm ? '✕ Cancel' : '+ Donate Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Total Donations',
              value: total,
              icon: '📦',
              color: '#FFF7F2',
              border: '#FFD7C7',
            },
            {
              label: 'Accepted',
              value: accepted,
              icon: '✅',
              color: '#F0FDF4',
              border: '#86EFAC',
            },
            {
              label: 'Pending',
              value: pending,
              icon: '⏳',
              color: '#FEFCE8',
              border: '#FDE047',
            },
            {
              label: 'Rejected',
              value: rejected,
              icon: '❌',
              color: '#FEF2F2',
              border: '#FECACA',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-5 border"
              style={{
                background: s.color,
                borderColor: s.border,
              }}
            >
              <p className="text-2xl mb-1">{s.icon}</p>

              <p
                className="text-2xl font-bold"
                style={{ color: '#2D2D2D' }}
              >
                {s.value}
              </p>

              <p
                className="text-sm"
                style={{ color: '#6B7280' }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Donation Form */}
        {showForm && (
          <div
            className="bg-white rounded-2xl p-8 mb-8 shadow-sm border"
            style={{ borderColor: '#FFE8DE' }}
          >
            <h2
              className="text-xl font-bold mb-6"
              style={{ color: '#2D2D2D' }}
            >
              Post a New Donation
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid sm:grid-cols-2 gap-5"
            >
              {/* Donation Type */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#2D2D2D' }}
                >
                  Donation Type
                </label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border outline-none text-sm"
                  style={{ borderColor: '#E5E7EB' }}
                >
                  <option value="Food">🍱 Food</option>
                  <option value="Clothes">👕 Clothes</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#2D2D2D' }}
                >
                  Quantity
                </label>

                <input
                  type="text"
                  required
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantity: e.target.value,
                    })
                  }
                  placeholder="e.g. 10 kg rice, 5 boxes meals"
                  className="w-full px-4 py-3 rounded-xl border outline-none text-sm"
                  style={{ borderColor: '#E5E7EB' }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = '#FF6B35')
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = '#E5E7EB')
                  }
                />
              </div>

              {/* Pickup Address */}
              <div className="sm:col-span-2">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#2D2D2D' }}
                >
                  Pickup Address
                </label>

                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
                    })
                  }
                  placeholder="Enter your full pickup address"
                  className="w-full px-4 py-3 rounded-xl border outline-none text-sm resize-none"
                  style={{ borderColor: '#E5E7EB' }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = '#FF6B35')
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = '#E5E7EB')
                  }
                />
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-xl text-white font-semibold text-sm flex items-center gap-2"
                  style={{
                    background: submitting
                      ? '#FFA07A'
                      : '#FF6B35',
                  }}
                >
                  {submitting ? (
                    <>
                      <Spinner size="sm" />
                      Posting...
                    </>
                  ) : (
                    'Submit Donation'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Donation History */}
        <div>
          <h2
            className="text-xl font-bold mb-5"
            style={{ color: '#2D2D2D' }}
          >
            Donation History
          </h2>

          {loading ? (
            <Spinner center />
          ) : donations.length === 0 ? (
            <div
              className="bg-white rounded-2xl p-16 text-center border"
              style={{ borderColor: '#FFE8DE' }}
            >
              <div className="text-6xl mb-4">🍱</div>

              <h3
                className="text-lg font-bold mb-2"
                style={{ color: '#2D2D2D' }}
              >
                No donations yet
              </h3>

              <p style={{ color: '#6B7280' }}>
                Click "Donate Now" to make your first donation!
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {donations.map((d) => (
                <div
                  key={d._id}
                  className="bg-white rounded-2xl p-6 border transition-all shadow-sm flex flex-col"
                  style={{ borderColor: '#F3F4F6', height: '100%' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = 'translateY(-3px)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = 'translateY(0)')
                  }
                >
                  {/* Donation Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: '#FFF7F2' }}
                      >
                        {d.type === 'Food' ? '🍱' : '👕'}
                      </div>

                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: '#2D2D2D' }}
                        >
                          {d.type}
                        </p>

                        <p
                          className="text-xs"
                          style={{ color: '#6B7280' }}
                        >
                          {new Date(d.createdAt).toLocaleDateString(
                            'en-IN',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={d.status} />
                  </div>

                  {/* Donation Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span style={{ color: '#6B7280' }}>
                        Qty:
                      </span>

                      <span
                        className="font-medium"
                        style={{ color: '#2D2D2D' }}
                      >
                        {d.quantity}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <span style={{ color: '#6B7280' }}>
                        📍
                      </span>

                      <span style={{ color: '#2D2D2D' }}>
                        {d.address}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    {/* Status-Based Delivery Tracker (Case-Insensitive) */}
                    {trackingStatuses.some(s => s.toLowerCase() === d.status?.toLowerCase()) && (
                      <DeliveryTracker donation={d} />
                    )}

                    {/* Proof of Delivery (Case-Insensitive check) */}
                    {d.status?.toLowerCase() === 'delivered' && (
                      <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                        {d.proofOfDelivery?.photoUrl ? (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">✅</span>
                              <h4 className="font-semibold text-green-800">
                                Food Delivered Successfully
                              </h4>
                            </div>

                            <p className="text-sm text-green-700 mb-1">
                              <strong>Receiver:</strong>{' '}
                              {d.proofOfDelivery.receiverName}
                            </p>

                            {d.proofOfDelivery.message && (
                              <p className="text-sm text-green-700 mb-2">
                                <strong>Message:</strong>{' '}
                                {d.proofOfDelivery.message}
                              </p>
                            )}

<img
  src={d.proofOfDelivery.photoUrl}
  alt="Delivery Proof"
  className="w-full max-h-64 object-cover rounded-lg mt-3 border border-green-200"
/>

<a
  href={d.proofOfDelivery.photoUrl}
  target="_blank"
  rel="noreferrer"
  className="inline-block mt-3 rounded-lg bg-green-700 px-4 py-2 text-xs font-semibold text-white hover:bg-green-800"
>
  📸 View Full Photo
</a>

                            {d.proofOfDelivery.uploadedAt && (
                              <p className="mt-2 text-xs text-green-600">
                                Proof uploaded on:{' '}
                                {new Date(
                                  d.proofOfDelivery.uploadedAt
                                ).toLocaleDateString('en-IN')}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="font-semibold text-yellow-800">
                              ⏳ Delivery completed
                            </p>

                            <p className="mt-1 text-sm text-yellow-700">
                              Proof of delivery has not been uploaded by the NGO yet.
                            </p>
                          </>
                        )}
                      </div>
                    )}

                    {/* Waiting Message (Case-Insensitive) */}
                    {d.status?.toLowerCase() === 'accepted' && (
                      <div className="mt-5 rounded-xl bg-blue-50 p-3 text-sm text-blue-700">
                        ⏳ Waiting for a volunteer to be assigned.
                      </div>
                    )}

                    {/* Pending Message (Case-Insensitive) */}
                    {d.status?.toLowerCase() === 'pending' && (
                      <div className="mt-5 rounded-xl bg-yellow-50 p-3 text-sm text-yellow-700">
                        ⏳ Waiting for NGO approval.
                      </div>
                    )}

                    {/* Rejected Message (Case-Insensitive) */}
                    {d.status?.toLowerCase() === 'rejected' && (
                      <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                        ❌ This donation was rejected.
                      </div>
                    )}
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