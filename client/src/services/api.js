import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const donationAPI = {
  create: (data) => axios.post(`${API_URL}/donations`, data),
  getAll: () => axios.get(`${API_URL}/donations`),
  updateStatus: (id, status) => axios.put(`${API_URL}/donations/${id}`, { status }),
};

export const volunteerAPI = {
  register: (data) => axios.post(`${API_URL}/volunteers`, data),
  getAll: () => axios.get(`${API_URL}/volunteers`),
};
