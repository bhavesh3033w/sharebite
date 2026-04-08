const express = require('express');
const router = express.Router();
const { registerVolunteer, getVolunteers } = require('../controllers/volunteerController');
const { protect, requireRole } = require('../middleware/auth');

router.post('/', protect, requireRole('volunteer'), registerVolunteer);
router.get('/', protect, requireRole('ngo'), getVolunteers);

module.exports = router;
