import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = "https://sharebite-backend-uucd.onrender.com/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/pending`);
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/admin/approve/${id}`, {
        verificationStatus: status
      });
      fetchPendingUsers();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <h1>Admin Dashboard</h1>
      <h2>Pending NGO & Volunteer Requests</h2>

      {users.length === 0 && (
        <p>No pending requests</p>
      )}

      {users.map((user) => (
        <div
          key={user._id}
          style={{
            border: '1px solid #e5e7eb',
            padding: '20px',
            marginTop: '20px',
            borderRadius: '12px',
            background: '#fff',
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
          }}
        >
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <p>Role: {user.role}</p>

          {/* View Certificate Button */}
          {user.ngoCertificate && (
            <button
              onClick={() =>
                window.open(
                    `https://sharebite-backend-uucd.onrender.com/${user.ngoCertificate}`,
                    '_blank'
                    )
              }
              style={{
                marginRight: '10px',
                background: '#2563eb',
                color: 'white',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              View Certificate
            </button>
          )}

          {/* Approve Button */}
          <button
            onClick={() => updateStatus(user._id, 'Approved')}
            style={{
              marginLeft: '10px',
              background: '#16a34a',
              color: 'white',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Approve
          </button>

          {/* Reject Button */}
          <button
            onClick={() => updateStatus(user._id, 'Rejected')}
            style={{
              marginLeft: '10px',
              background: '#dc2626',
              color: 'white',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;