import axios from 'axios';

const API_URL = "https://sharebite-backend-uucd.onrender.com/api";

export const donationAPI = {
  // Create donation
  create: (data) =>
    axios.post(`${API_URL}/donations`, data),

  // Get all relevant donations
  getAll: () =>
    axios.get(`${API_URL}/donations`),

  // NGO accepts or rejects donation
  updateStatus: (id, status) =>
    axios.put(
      `${API_URL}/donations/${id}`,
      { status }
    ),

  // NGO assigns volunteer
  assignVolunteer: (id, volunteerId) =>
    axios.put(
      `${API_URL}/donations/${id}/assign-volunteer`,
      { volunteerId }
    ),

  // NGO unassigns volunteer
  unassignVolunteer: (id) =>
    axios.put(
      `${API_URL}/donations/${id}/unassign-volunteer`
    ),

  // Volunteer updates delivery status
  updateDeliveryStatus: (id, status, deliveryNotes = '') =>
    axios.put(
      `${API_URL}/donations/${id}/delivery-status`,
      {
        status,
        deliveryNotes
      }
    ),

  // NGO uploads Proof of Delivery
  uploadProofOfDelivery: (id, data) =>
    axios.put(
      `${API_URL}/donations/${id}/proof-of-delivery`,
      data
    ),

  // Get donation tracking details
  getTracking: (id) =>
    axios.get(
      `${API_URL}/donations/${id}/tracking`
    ),
};

export const volunteerAPI = {
  // Register volunteer
  register: (data) =>
    axios.post(
      `${API_URL}/volunteers`,
      data
    ),

  // Get all volunteers
  getAll: () =>
    axios.get(
      `${API_URL}/volunteers`
    ),
};