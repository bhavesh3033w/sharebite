
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { volunteerAPI, donationAPI } from '../../../services/api';
import Spinner from '../../../components/Spinner';
import toast from 'react-hot-toast';

const tips = [
  {
    icon: '📦',
    title: 'Help with Pickups',
    desc: 'Collect donations from donor addresses and transport to NGO centers.',
  },
  {
    icon: '🚚',
    title: 'Delivery Runs',
    desc: 'Help NGOs distribute food and clothes to families in need.',
  },
  {
    icon: '📋',
    title: 'On-Ground Support',
    desc: 'Assist at NGO events, manage queues, and support distribution drives.',
  },
];

const deliveryStatuses = [
  'Pickup Started',
  'Picked Up',
  'Out for Delivery',
  'Delivered',
];

const VolunteerDashboard = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    skills: '',
    contact: '',
    availabilityStatus: 'Available',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch assigned donations
  const fetchDonations = async () => {
    try {
      setDonationsLoading(true);

      const response = await donationAPI.getAll();

      console.log('Volunteer donations:', response.data);

      setDonations(response.data || []);
    } catch (error) {
      console.error('Failed to fetch donations:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to load assigned donations'
      );
    } finally {
      setDonationsLoading(false);
    }
  };

  // Fetch donations when dashboard loads
  useEffect(() => {
    fetchDonations();
  }, []);

  // Register volunteer
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await volunteerAPI.register(form);

      toast.success("You're registered as a volunteer! 🎉");

      setSubmitted(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  // Update delivery status
  const handleStatusUpdate = async (donationId, status) => {
    try {
      setUpdatingId(donationId);

      await donationAPI.updateDeliveryStatus(
        donationId,
        status
      );

      toast.success(`Status updated to ${status}`);

      // Refresh donations after update
      await fetchDonations();
    } catch (error) {
      console.error('Status update failed:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to update delivery status'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Return next available status buttons
  const getNextStatuses = (currentStatus) => {
    const statusFlow = {
      'Volunteer Assigned': ['Pickup Started'],
      'Pickup Started': ['Picked Up'],
      'Picked Up': ['Out for Delivery'],
      'Out for Delivery': ['Delivered'],
      'Delivered': [],
    };

    return statusFlow[currentStatus] || [];
  };

  return (
    <div
      style={{
        background: '#FFF7F2',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2EC4B6, #1A9E92)',
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b7?w=1200&q=60"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-12 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
            }}
          >
            🙌 Volunteer Portal
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">
            Hello, {user?.name}! 👋
          </h1>

          <p
            className="text-lg max-w-xl mx-auto"
            style={{
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            Your time and skills can feed families.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Assigned Donations Section */}
        <div className="mb-10">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
            <h2
              className="text-2xl font-bold"
              style={{ color: '#2D2D2D' }}
            >
              🚚 Assigned Donations
            </h2>

            <button
              onClick={fetchDonations}
              disabled={donationsLoading}
              className="px-4 py-2 rounded-xl text-white font-semibold"
              style={{ background: '#2EC4B6' }}
            >
              🔄 Refresh
            </button>
          </div>

          {donationsLoading ? (
            <div className="bg-white rounded-2xl p-8 text-center border">
              <Spinner size="sm" />
              <p className="mt-3 text-gray-500">
                Loading assigned donations...
              </p>
            </div>
          ) : donations.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border">
              <div className="text-5xl mb-3">📦</div>

              <h3 className="text-lg font-bold mb-2">
                No Assigned Donations
              </h3>

              <p className="text-gray-500">
                Donations assigned to you will appear here.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {donations.map((donation) => {
                const nextStatuses = getNextStatuses(
                  donation.status
                );

                return (
                  <div
                    key={donation._id}
                    className="bg-white rounded-2xl p-6 border shadow-sm"
                    style={{ borderColor: '#E5E7EB' }}
                  >
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <h3 className="text-lg font-bold">
                        {donation.type} Donation
                      </h3>

                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{
                          background: '#DFF8F4',
                          color: '#168579',
                        }}
                      >
                        {donation.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <strong>Quantity:</strong>{' '}
                        {donation.quantity}
                      </p>

                      <p>
                        <strong>Address:</strong>{' '}
                        {donation.address}
                      </p>

                      <p>
                        <strong>Donor:</strong>{' '}
                        {donation.userId?.name ||
                          donation.donorName ||
                          'Not available'}
                      </p>

                      <p>
                        <strong>Assigned At:</strong>{' '}
                        {donation.assignedAt
                          ? new Date(
                              donation.assignedAt
                            ).toLocaleString()
                          : 'Not available'}
                      </p>
                    </div>

                    {/* Status update buttons */}
                    {nextStatuses.length > 0 && (
                      <div className="mt-5">
                        <p className="text-sm font-semibold mb-2">
                          Update Delivery Status
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {nextStatuses.map((status) => (
                            <button
                              key={status}
                              onClick={() =>
                                handleStatusUpdate(
                                  donation._id,
                                  status
                                )
                              }
                              disabled={
                                updatingId === donation._id
                              }
                              className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
                              style={{
                                background:
                                  updatingId === donation._id
                                    ? '#9CA3AF'
                                    : '#2EC4B6',
                              }}
                            >
                              {updatingId === donation._id
                                ? 'Updating...'
                                : status}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {donation.status === 'Delivered' && (
                      <div className="mt-4 p-3 rounded-xl bg-green-50 text-green-700 text-sm font-semibold">
                        ✅ Donation delivered successfully
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Registration and Tips */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT SIDE FORM */}
          <div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ color: '#2D2D2D' }}
            >
              Volunteer Registration
            </h2>

            {submitted ? (
              <div
                className="bg-white rounded-2xl p-10 text-center border shadow-sm"
                style={{ borderColor: '#B2EFE8' }}
              >
                <div className="text-6xl mb-4">🎉</div>

                <h3 className="text-xl font-bold mb-2">
                  You're registered!
                </h3>

                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 rounded-xl text-white"
                  style={{ background: '#2EC4B6' }}
                >
                  Update Details
                </button>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl p-7 border shadow-sm"
                style={{ borderColor: '#E5E7EB' }}
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Name */}
                  <div>
                    <label className="block mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border"
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block mb-2">
                      Your Skills
                    </label>

                    <input
                      type="text"
                      required
                      value={form.skills}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          skills: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border"
                    />
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block mb-2">
                      Phone / Contact
                    </label>

                    <input
                      type="text"
                      required
                      value={form.contact}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          contact: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border"
                    />
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block mb-2">
                      Availability Status
                    </label>

                    <select
                      value={form.availabilityStatus}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          availabilityStatus: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border"
                    >
                      <option value="Available">
                        Available
                      </option>

                      <option value="Busy">
                        Busy
                      </option>

                      <option value="Not Available">
                        Not Available
                      </option>
                    </select>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-white font-semibold"
                    style={{
                      background: loading
                        ? '#7DDED7'
                        : '#2EC4B6',
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" />
                        Registering...
                      </>
                    ) : (
                      'Register as Volunteer 🙌'
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT SIDE TIPS */}
          <div>
            <h2 className="text-xl font-bold mb-6">
              How You Can Help
            </h2>

            <div className="space-y-4">
              {tips.map((t) => (
                <div
                  key={t.title}
                  className="bg-white rounded-2xl p-5 border flex gap-4"
                >
                  <div className="text-2xl">
                    {t.icon}
                  </div>

                  <div>
                    <p className="font-semibold">
                      {t.title}
                    </p>

                    <p className="text-sm text-gray-500">
                      {t.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
