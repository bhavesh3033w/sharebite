const express = require('express');

const router = express.Router();

const {
  createDonation,
  getDonations,
  updateDonation,
  assignVolunteer,
  updateDeliveryStatus,
  getDonationTracking
} = require('../controllers/donationController');

const {
  protect,
  requireRole
} = require('../middleware/auth');

// Donor creates donation
router.post(
  '/',
  protect,
  requireRole('donor'),
  createDonation
);

// Get donations
router.get(
  '/',
  protect,
  getDonations
);

// View tracking details
// Keep this before generic /:id routes
router.get(
  '/:id/tracking',
  protect,
  getDonationTracking
);

// NGO assigns volunteer
router.put(
  '/:id/assign-volunteer',
  protect,
  requireRole('ngo'),
  assignVolunteer
);

// Volunteer updates delivery status
router.put(
  '/:id/delivery-status',
  protect,
  requireRole('volunteer'),
  updateDeliveryStatus
);

// NGO accepts or rejects donation
// Keep generic /:id route at the end
router.put(
  '/:id',
  protect,
  requireRole('ngo'),
  updateDonation
);

module.exports = router;