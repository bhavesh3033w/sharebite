import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://sharebite-backend-uucd.onrender.com/api';

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const [stats, setStats] = useState({
    totalDonations: 0,
    deliveredDonations: 0,
    pendingDonations: 0,
    totalUsers: 0,
    pendingNGOs: 0,
    pendingVolunteers: 0,
  });

  const [donations, setDonations] = useState([]);
  const [selectedProof, setSelectedProof] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // =========================
  // FETCH DATA
  // =========================

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/pending`);
      setUsers(res.data);
    } catch (error) {
      console.log('Pending users error:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/stats`);
      setStats(res.data);
    } catch (error) {
      console.log('Stats error:', error);
    }
  };

  const fetchDonations = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/donations`);
      setDonations(res.data);
    } catch (error) {
      console.log('Donations error:', error);
    }
  };

  const loadDashboard = async () => {
    setLoading(true);

    await Promise.all([
      fetchPendingUsers(),
      fetchStats(),
      fetchDonations(),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =========================
  // APPROVE / REJECT
  // =========================

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/admin/approve/${id}`, {
        verificationStatus: status,
      });

      fetchPendingUsers();
      fetchStats();
    } catch (error) {
      console.log('Status update error:', error);
    }
  };

  // =========================
  // HELPERS
  // =========================

  const getStatusClass = (status) => {
    if (status === 'Delivered') {
      return {
        background: '#dcfce7',
        color: '#166534',
      };
    }

    if (status === 'Pending') {
      return {
        background: '#fef3c7',
        color: '#92400e',
      };
    }

    if (status === 'Accepted') {
      return {
        background: '#dbeafe',
        color: '#1d4ed8',
      };
    }

    if (status === 'Rejected') {
      return {
        background: '#fee2e2',
        color: '#991b1b',
      };
    }

    return {
      background: '#f3f4f6',
      color: '#374151',
    };
  };

  const filteredDonations = donations.filter((donation) => {
    const donorName = donation.userId?.name || '';
    const donationType = donation.type || '';
    const donationStatus = donation.status || '';

    const matchesSearch =
      donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donationStatus.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || donation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================
  // UI
  // =========================

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: 'Inter, Arial, sans-serif',
        color: '#111827',
      }}
    >
      {/* ================= SIDEBAR ================= */}

      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '230px',
          background: '#171717',
          color: 'white',
          padding: '28px 20px',
          boxSizing: 'border-box',
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontSize: '24px',
            fontWeight: '800',
            marginBottom: '8px',
          }}
        >
          🍊 ShareBite
        </div>

        <div
          style={{
            color: '#a3a3a3',
            fontSize: '12px',
            marginBottom: '40px',
          }}
        >
          ADMIN CONTROL CENTER
        </div>

        <div
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            })
          }
          style={{
            background: '#f97316',
            borderRadius: '12px',
            padding: '13px 15px',
            fontWeight: '600',
            marginBottom: '10px',
            cursor: 'pointer',
          }}
        >
          📊 Dashboard
        </div>

        <div
          onClick={() =>
            document.getElementById('donations-section')?.scrollIntoView({
              behavior: 'smooth',
            })
          }
          style={{
            padding: '13px 15px',
            color: '#a3a3a3',
            cursor: 'pointer',
            borderRadius: '10px',
          }}
        >
          📦 Donations
        </div>

        <div
          onClick={() =>
            document.getElementById('users-section')?.scrollIntoView({
              behavior: 'smooth',
            })
          }
          style={{
            padding: '13px 15px',
            color: '#a3a3a3',
            cursor: 'pointer',
            borderRadius: '10px',
          }}
        >
          👥 Users
        </div>

        <div
          onClick={() =>
            document.getElementById('verification-section')?.scrollIntoView({
              behavior: 'smooth',
            })
          }
          style={{
            padding: '13px 15px',
            color: '#a3a3a3',
            cursor: 'pointer',
            borderRadius: '10px',
          }}
        >
          ✓ Verification
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '25px',
            left: '20px',
            right: '20px',
            borderTop: '1px solid #333',
            paddingTop: '20px',
          }}
        >
          <div style={{ fontSize: '13px', color: '#a3a3a3' }}>
            Logged in as
          </div>

          <div
            style={{
              fontWeight: '700',
              marginTop: '4px',
            }}
          >
            Administrator
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <main
        style={{
          marginLeft: '230px',
          padding: '35px',
          maxWidth: '1500px',
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
          }}
        >
          <div>
            <div
              style={{
                color: '#f97316',
                fontSize: '13px',
                fontWeight: '700',
                letterSpacing: '1px',
              }}
            >
              SHAREBITE ADMIN
            </div>

            <h1
              style={{
                margin: '6px 0',
                fontSize: '32px',
                fontWeight: '800',
              }}
            >
              Good morning, Admin 👋
            </h1>

            <p
              style={{
                margin: 0,
                color: '#6b7280',
              }}
            >
              Here's what's happening across ShareBite today.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            disabled={loading}
            style={{
              border: '1px solid #e5e7eb',
              background: 'white',
              padding: '11px 18px',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              opacity: loading ? 0.65 : 1,
            }}
          >
            {loading ? 'Loading...' : '↻ Refresh'}
          </button>
        </div>

        {/* ================= STATS ================= */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '18px',
            marginBottom: '25px',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #f97316, #fb923c)',
              color: 'white',
              padding: '22px',
              borderRadius: '18px',
              boxShadow: '0 10px 25px rgba(249,115,22,0.18)',
            }}
          >
            <div style={{ fontSize: '28px' }}>📦</div>

            <div
              style={{
                marginTop: '18px',
                fontSize: '32px',
                fontWeight: '800',
              }}
            >
              {stats.totalDonations}
            </div>

            <div style={{ opacity: 0.9 }}>Total Donations</div>
          </div>

          <div
            style={{
              background: 'white',
              padding: '22px',
              borderRadius: '18px',
              border: '1px solid #e5e7eb',
            }}
          >
            <div style={{ fontSize: '28px' }}>🚚</div>

            <div
              style={{
                marginTop: '18px',
                fontSize: '32px',
                fontWeight: '800',
              }}
            >
              {stats.deliveredDonations}
            </div>

            <div style={{ color: '#6b7280' }}>Delivered</div>
          </div>

          <div
            style={{
              background: 'white',
              padding: '22px',
              borderRadius: '18px',
              border: '1px solid #e5e7eb',
            }}
          >
            <div style={{ fontSize: '28px' }}>⏳</div>

            <div
              style={{
                marginTop: '18px',
                fontSize: '32px',
                fontWeight: '800',
              }}
            >
              {stats.pendingDonations}
            </div>

            <div style={{ color: '#6b7280' }}>Pending Donations</div>
          </div>

          <div
            style={{
              background: 'white',
              padding: '22px',
              borderRadius: '18px',
              border: '1px solid #e5e7eb',
            }}
          >
            <div style={{ fontSize: '28px' }}>👥</div>

            <div
              style={{
                marginTop: '18px',
                fontSize: '32px',
                fontWeight: '800',
              }}
            >
              {stats.totalUsers}
            </div>

            <div style={{ color: '#6b7280' }}>Total Users</div>
          </div>
        </div>

        {/* ================= TWO COLUMN ================= */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr',
            gap: '22px',
            marginBottom: '25px',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '18px',
              padding: '25px',
              border: '1px solid #e5e7eb',
            }}
          >
            <h2 style={{ marginTop: 0 }}>Donation Overview</h2>

            <p
              style={{
                color: '#6b7280',
                marginBottom: '25px',
              }}
            >
              Current donation activity
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px',
              }}
            >
              <div
                style={{
                  background: '#fff7ed',
                  padding: '18px',
                  borderRadius: '14px',
                }}
              >
                <div style={{ color: '#f97316' }}>TOTAL</div>

                <strong
                  style={{
                    display: 'block',
                    fontSize: '25px',
                    marginTop: '8px',
                  }}
                >
                  {stats.totalDonations}
                </strong>
              </div>

              <div
                style={{
                  background: '#f0fdf4',
                  padding: '18px',
                  borderRadius: '14px',
                }}
              >
                <div style={{ color: '#16a34a' }}>DELIVERED</div>

                <strong
                  style={{
                    display: 'block',
                    fontSize: '25px',
                    marginTop: '8px',
                  }}
                >
                  {stats.deliveredDonations}
                </strong>
              </div>

              <div
                style={{
                  background: '#fffbeb',
                  padding: '18px',
                  borderRadius: '14px',
                }}
              >
                <div style={{ color: '#d97706' }}>PENDING</div>

                <strong
                  style={{
                    display: 'block',
                    fontSize: '25px',
                    marginTop: '8px',
                  }}
                >
                  {stats.pendingDonations}
                </strong>
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#171717',
              color: 'white',
              borderRadius: '18px',
              padding: '25px',
            }}
          >
            <h2 style={{ marginTop: 0 }}>Verification Queue</h2>

            <p
              style={{
                color: '#a3a3a3',
              }}
            >
              Requests waiting for review
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '18px 0',
                borderBottom: '1px solid #333',
              }}
            >
              <span>🏢 NGO Requests</span>

              <strong
                style={{
                  color: '#fb923c',
                  fontSize: '22px',
                }}
              >
                {stats.pendingNGOs}
              </strong>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '18px 0',
              }}
            >
              <span>🚴 Volunteers</span>

              <strong
                style={{
                  color: '#fb923c',
                  fontSize: '22px',
                }}
              >
                {stats.pendingVolunteers}
              </strong>
            </div>
          </div>
        </div>

        {/* ================= VERIFICATION REQUESTS ================= */}

        <div
          id="verification-section"
          style={{
            background: 'white',
            borderRadius: '18px',
            padding: '25px',
            border: '1px solid #e5e7eb',
            marginBottom: '25px',
          }}
        >
          <div
            id="users-section"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              scrollMarginTop: '25px',
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>Verification Requests</h2>

              <p
                style={{
                  color: '#6b7280',
                  margin: '5px 0 0',
                }}
              >
                Review NGO and volunteer registrations
              </p>
            </div>

            <span
              style={{
                background: '#fff7ed',
                color: '#c2410c',
                padding: '8px 12px',
                borderRadius: '20px',
                fontWeight: '700',
              }}
            >
              {users.length} Pending
            </span>
          </div>

          {users.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '35px',
                color: '#6b7280',
              }}
            >
              🎉 No pending verification requests
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {users.map((user) => (
                <div
                  key={user._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '14px',
                    background: '#fafafa',
                    gap: '15px',
                  }}
                >
                  <div>
                    <strong
                      style={{
                        fontSize: '16px',
                      }}
                    >
                      {user.name}
                    </strong>

                    <div
                      style={{
                        color: '#6b7280',
                        fontSize: '13px',
                        marginTop: '4px',
                      }}
                    >
                      {user.email}
                    </div>
                  </div>

                  <span
                    style={{
                      background: '#f3f4f6',
                      padding: '7px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                    }}
                  >
                    {user.role}
                  </span>

                  <div>
                    {user.ngoCertificate && (
                      <button
                      onClick={() =>
                        window.open(
                          user.ngoCertificate,
                          '_blank',
                          'noopener,noreferrer'
                        )
                      }
                        style={{
                          marginRight: '8px',
                          background: '#2563eb',
                          color: 'white',
                          border: 'none',
                          padding: '9px 14px',
                          borderRadius: '9px',
                          cursor: 'pointer',
                          fontWeight: '600',
                        }}
                      >
                        View Certificate
                      </button>
                    )}

                    <button
                      onClick={() => updateStatus(user._id, 'Approved')}
                      style={{
                        background: '#16a34a',
                        color: 'white',
                        border: 'none',
                        padding: '9px 14px',
                        borderRadius: '9px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        marginRight: '8px',
                      }}
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(user._id, 'Rejected')}
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '9px 14px',
                        borderRadius: '9px',
                        cursor: 'pointer',
                        fontWeight: '600',
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= RECENT DONATIONS ================= */}

        <div
          id="donations-section"
          style={{
            background: 'white',
            borderRadius: '18px',
            padding: '25px',
            border: '1px solid #e5e7eb',
            scrollMarginTop: '25px',
          }}
        >
          <div
            style={{
              marginBottom: '20px',
            }}
          >
            <h2 style={{ margin: 0 }}>Recent Donations & Deliveries</h2>

            <p
              style={{
                color: '#6b7280',
                marginTop: '5px',
              }}
            >
              Monitor donation status and proof of delivery
            </p>
          </div>

          {/* Search and Filter */}

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '20px',
            }}
          >
            <input
              type="text"
              placeholder="Search by donor, type, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '11px 13px',
                border: '1px solid #d1d5db',
                borderRadius: '9px',
                outline: 'none',
                fontSize: '14px',
              }}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '11px 13px',
                border: '1px solid #d1d5db',
                borderRadius: '9px',
                outline: 'none',
                background: 'white',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Delivered">Delivered</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {filteredDonations.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '35px',
                color: '#6b7280',
              }}
            >
              No donations available.
            </div>
          ) : (
            <div
              style={{
                overflowX: 'auto',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}
              >
                <thead>
                  <tr
                    style={{
                      textAlign: 'left',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    <th style={{ padding: '13px' }}>Donation</th>
                    <th style={{ padding: '13px' }}>Donor</th>
                    <th style={{ padding: '13px' }}>Status</th>
                    <th style={{ padding: '13px' }}>Details</th>
                    <th style={{ padding: '13px' }}>Proof</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDonations.slice(0, 10).map((donation) => {
                    const statusStyle = getStatusClass(donation.status);

                    return (
                      <tr
                        key={donation._id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                        }}
                      >
                        <td style={{ padding: '15px' }}>
                          <strong>{donation.type || 'Donation'}</strong>

                          <div
                            style={{
                              color: '#6b7280',
                              fontSize: '12px',
                              marginTop: '4px',
                            }}
                          >
                            {donation.quantity || '-'}
                          </div>
                        </td>

                        <td style={{ padding: '15px' }}>
                          {donation.userId?.name || 'Unknown'}
                        </td>

                        <td style={{ padding: '15px' }}>
                          <span
                            style={{
                              ...statusStyle,
                              padding: '6px 10px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '700',
                            }}
                          >
                            {donation.status}
                          </span>
                        </td>

                        <td style={{ padding: '15px' }}>
                          <button
                            onClick={() => setSelectedDonation(donation)}
                            style={{
                              background: '#fff7ed',
                              color: '#c2410c',
                              border: '1px solid #fed7aa',
                              padding: '8px 13px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '600',
                            }}
                          >
                            View Details
                          </button>
                        </td>

                        <td style={{ padding: '15px' }}>
                          {donation.proofOfDelivery?.photoUrl ? (
                            <button
                              onClick={() =>
                                setSelectedProof(donation.proofOfDelivery)
                              }
                              style={{
                                background: '#111827',
                                color: 'white',
                                border: 'none',
                                padding: '8px 13px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                              }}
                            >
                              ✓ View Proof
                            </button>
                          ) : (
                            <span
                              style={{
                                color: '#9ca3af',
                                fontSize: '13px',
                              }}
                            >
                              Not uploaded
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ================= DONATION DETAILS MODAL ================= */}

      {selectedDonation && (
        <div
          onClick={() => setSelectedDonation(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 90,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '22px',
              boxShadow: '0 25px 70px rgba(0,0,0,0.3)',
            }}
          >
            {/* HEADER */}

            <div
              style={{
                padding: '22px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h2 style={{ margin: 0 }}>Donation Details</h2>

                <p
                  style={{
                    margin: '5px 0 0',
                    color: '#6b7280',
                    fontSize: '13px',
                  }}
                >
                  Complete donation lifecycle
                </p>
              </div>

              <button
                onClick={() => setSelectedDonation(null)}
                style={{
                  border: 'none',
                  background: '#f3f4f6',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                ✕
              </button>
            </div>

            {/* DONATION INFO */}

            <div style={{ padding: '22px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    background: '#fff7ed',
                    padding: '16px',
                    borderRadius: '12px',
                  }}
                >
                  <small>DONATION TYPE</small>

                  <strong
                    style={{
                      display: 'block',
                      marginTop: '6px',
                    }}
                  >
                    {selectedDonation.type || 'N/A'}
                  </strong>
                </div>

                <div
                  style={{
                    background: '#f8fafc',
                    padding: '16px',
                    borderRadius: '12px',
                  }}
                >
                  <small>QUANTITY</small>

                  <strong
                    style={{
                      display: 'block',
                      marginTop: '6px',
                    }}
                  >
                    {selectedDonation.quantity || 'N/A'}
                  </strong>
                </div>

                <div
                  style={{
                    background: '#f8fafc',
                    padding: '16px',
                    borderRadius: '12px',
                  }}
                >
                  <small>DONOR</small>

                  <strong
                    style={{
                      display: 'block',
                      marginTop: '6px',
                    }}
                  >
                    {selectedDonation.userId?.name || 'Unknown'}
                  </strong>
                </div>

                <div
                  style={{
                    background: '#f8fafc',
                    padding: '16px',
                    borderRadius: '12px',
                  }}
                >
                  <small>STATUS</small>

                  <strong
                    style={{
                      display: 'block',
                      marginTop: '6px',
                    }}
                  >
                    {selectedDonation.status || 'N/A'}
                  </strong>
                </div>
              </div>

              {/* ADDRESS */}

              <div
                style={{
                  marginTop: '14px',
                  background: '#f8fafc',
                  padding: '16px',
                  borderRadius: '12px',
                }}
              >
                <small>DELIVERY ADDRESS</small>

                <div style={{ marginTop: '6px' }}>
                  {selectedDonation.address || 'Not provided'}
                </div>
              </div>

              {/* ACCEPTED NGO */}

              <div
                style={{
                  marginTop: '14px',
                  background: '#f8fafc',
                  padding: '16px',
                  borderRadius: '12px',
                }}
              >
                <small>ACCEPTED BY NGO</small>

                <div style={{ marginTop: '6px' }}>
                  {selectedDonation.acceptedBy?.name || 'Not assigned'}
                </div>
              </div>

              {/* VOLUNTEER */}

              <div
                style={{
                  marginTop: '14px',
                  background: '#f8fafc',
                  padding: '16px',
                  borderRadius: '12px',
                }}
              >
                <small>ASSIGNED VOLUNTEER</small>

                <div style={{ marginTop: '6px' }}>
                  {selectedDonation.assignedVolunteer?.name ||
                    'Not assigned'}
                </div>
              </div>

              {/* LIFECYCLE */}

              <div
                style={{
                  marginTop: '22px',
                  padding: '18px',
                  background: '#171717',
                  color: 'white',
                  borderRadius: '15px',
                }}
              >
                <h3 style={{ marginTop: 0 }}>Donation Journey</h3>

                <div style={{ lineHeight: '2.2' }}>
                  <div>🟢 Donation Created</div>
                  <div>↓</div>

                  <div>
                    {selectedDonation.acceptedBy
                      ? '🟢 NGO Accepted'
                      : '⚪ NGO Not Assigned'}
                  </div>

                  <div>↓</div>

                  <div>
                    {selectedDonation.assignedVolunteer
                      ? '🟢 Volunteer Assigned'
                      : '⚪ Volunteer Not Assigned'}
                  </div>

                  <div>↓</div>

                  <div>
                    {selectedDonation.status === 'Delivered'
                      ? '🟢 Delivered'
                      : '🟡 Delivery Pending'}
                  </div>

                  <div>↓</div>

                  <div>
                    {selectedDonation.proofOfDelivery?.photoUrl
                      ? '🟢 Proof of Delivery Uploaded'
                      : '⚪ Proof Not Uploaded'}
                  </div>
                </div>
              </div>

              {/* PROOF */}

              {selectedDonation.proofOfDelivery?.photoUrl && (
                <button
                  onClick={() => {
                    setSelectedDonation(null);
                    setSelectedProof(selectedDonation.proofOfDelivery);
                  }}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '13px',
                    background: '#f97316',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '700',
                  }}
                >
                  📸 View Proof of Delivery
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= PROOF MODAL ================= */}

      {selectedProof && (
        <div
          onClick={() => setSelectedProof(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              width: '100%',
              maxWidth: '550px',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
            }}
          >
            <div
              style={{
                padding: '20px 22px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <div>
                <h2 style={{ margin: 0 }}>Proof of Delivery</h2>

                <div
                  style={{
                    color: '#6b7280',
                    fontSize: '13px',
                    marginTop: '4px',
                  }}
                >
                  Delivery confirmation
                </div>
              </div>

              <button
                onClick={() => setSelectedProof(null)}
                style={{
                  border: 'none',
                  background: '#f3f4f6',
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                ✕
              </button>
            </div>

            <img
              src={selectedProof.photoUrl}
              alt="Proof of delivery"
              style={{
                width: '100%',
                maxHeight: '330px',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            <div
              style={{
                padding: '22px',
              }}
            >
              <div
                style={{
                  background: '#f8fafc',
                  padding: '15px',
                  borderRadius: '12px',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '4px',
                  }}
                >
                  RECEIVER
                </div>

                <strong>
                  {selectedProof.receiverName || 'Not provided'}
                </strong>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  padding: '15px',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '4px',
                  }}
                >
                  MESSAGE
                </div>

                <span>
                  {selectedProof.message || 'No message provided'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= RESPONSIVE ================= */}

      <style>
        {`
          @media (max-width: 1000px) {
            aside {
              width: 190px !important;
            }

            main {
              margin-left: 190px !important;
            }
          }

          @media (max-width: 800px) {
            aside {
              display: none !important;
            }

            main {
              margin-left: 0 !important;
              padding: 20px !important;
            }

            main > div:nth-child(2) {
              grid-template-columns: repeat(2, 1fr) !important;
            }

            main > div:nth-child(3) {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 550px) {
            main > div:nth-child(2) {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default AdminDashboard;