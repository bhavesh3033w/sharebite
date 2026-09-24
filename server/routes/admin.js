const express = require('express');
const router = express.Router();

const {
  getPendingUsers,
  updateVerificationStatus,
  getAdminStats,
  getAdminDonations
} = require('../controllers/adminController');

// Pending NGO & Volunteer requests
router.get('/pending', getPendingUsers);

// Approve / Reject NGO or Volunteer
router.put('/approve/:id', updateVerificationStatus);

// Admin dashboard statistics
router.get('/stats', getAdminStats);

// All donations with delivery/proof details
router.get('/donations', getAdminDonations);

module.exports = router;