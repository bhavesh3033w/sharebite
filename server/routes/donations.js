const express = require('express');
const router = express.Router();
const { createDonation, getDonations, updateDonation } = require('../controllers/donationController');
const { protect, requireRole } = require('../middleware/auth');

router.post('/', protect, requireRole('donor'), createDonation);
router.get('/', protect, getDonations);
router.put('/:id', protect, requireRole('ngo'), updateDonation);

module.exports = router;
