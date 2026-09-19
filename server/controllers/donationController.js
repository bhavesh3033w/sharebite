const Donation = require('../models/Donation');
const User = require('../models/User');

// POST /api/donations
// Donor creates donation
const createDonation = async (req, res) => {
  try {
    const { type, quantity, address } = req.body;

    if (!type || !quantity || !address) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    const donation = await Donation.create({
      type,
      quantity,
      address,
      userId: req.user._id,
      donorName: req.user.name
    });

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET /api/donations
// Donor, NGO and Volunteer get relevant donations
const getDonations = async (req, res) => {
  try {
    let donations;

    if (req.user.role === 'ngo') {
      donations = await Donation.find()
        .sort({ createdAt: -1 })
        .populate('userId', 'name email')
        .populate('acceptedBy', 'name email')
        .populate('assignedVolunteer', 'name email');

    } else if (req.user.role === 'volunteer') {
      // Debug logs added here
      console.log('Logged-in User ID:', req.user._id);
      console.log('Logged-in Role:', req.user.role);

      // added .populate('assignedVolunteer', 'name email')
      donations = await Donation.find({
        assignedVolunteer: req.user._id
      })
        .sort({ createdAt: -1 })
        .populate('userId', 'name email')
        .populate('acceptedBy', 'name email')
        .populate('assignedVolunteer', 'name email'); 

      // Debug log added here
      console.log('Volunteer Donations:', donations);

    } else {
      donations = await Donation.find({
        userId: req.user._id
      })
        .sort({ createdAt: -1 })
        .populate('acceptedBy', 'name email')
        .populate('assignedVolunteer', 'name email');
    }

    res.json(donations);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// PUT /api/donations/:id
// NGO accepts or rejects donation
const updateDonation = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status value'
      });
    }

    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        message: 'Donation not found'
      });
    }

    if (donation.status !== 'Pending') {
      return res.status(400).json({
        message: 'Donation is already processed'
      });
    }

    if (status === 'Accepted') {
      donation.status = 'Accepted';
      donation.acceptedBy = req.user._id;
      donation.acceptedAt = new Date();
    }

    if (status === 'Rejected') {
      donation.status = 'Rejected';
    }

    await donation.save();

    res.json({
      message: `Donation ${status.toLowerCase()} successfully`,
      donation
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// PUT /api/donations/:id/assign-volunteer
// NGO assigns a volunteer
const assignVolunteer = async (req, res) => {
  try {
    const { volunteerId } = req.body;

    if (!volunteerId) {
      return res.status(400).json({
        message: 'Volunteer ID is required'
      });
    }

    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        message: 'Donation not found'
      });
    }

    if (donation.acceptedBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Only the accepting NGO can assign a volunteer'
      });
    }

    if (donation.status !== 'Accepted') {
      return res.status(400).json({
        message: 'Only accepted donations can be assigned'
      });
    }

    // ✅ Updated to verify approved volunteer status
    const volunteer = await User.findOne({
      _id: volunteerId,
      role: 'volunteer',
      verificationStatus: 'Approved'
    });

    if (!volunteer) {
      return res.status(404).json({
        message: 'Approved volunteer not found'
      });
    }

    donation.assignedVolunteer = volunteer._id;
    donation.assignedAt = new Date();
    donation.status = 'Volunteer Assigned';

    await donation.save();

    res.json({
      message: 'Volunteer assigned successfully',
      donation
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// PUT /api/donations/:id/delivery-status
// Assigned volunteer updates delivery status
const updateDeliveryStatus = async (req, res) => {
  try {
    const { status, deliveryNotes } = req.body;

    const allowedStatuses = [
      'Pickup Started',
      'Picked Up',
      'Out for Delivery',
      'Delivered'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid delivery status'
      });
    }

    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        message: 'Donation not found'
      });
    }

    if (
      !donation.assignedVolunteer ||
      donation.assignedVolunteer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'You are not assigned to this donation'
      });
    }

    donation.status = status;

    if (deliveryNotes) {
      donation.deliveryNotes = deliveryNotes;
    }

    if (status === 'Delivered') {
      donation.deliveredAt = new Date();
    }

    await donation.save();

    res.json({
      message: 'Delivery status updated successfully',
      donation
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET /api/donations/:id/tracking
// View donation tracking details
const getDonationTracking = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('acceptedBy', 'name email')
      .populate('assignedVolunteer', 'name email');

    if (!donation) {
      return res.status(404).json({
        message: 'Donation not found'
      });
    }

    const isDonor =
      donation.userId._id.toString() === req.user._id.toString();

    const isNGO =
      donation.acceptedBy &&
      donation.acceptedBy._id.toString() === req.user._id.toString();

    const isVolunteer =
      donation.assignedVolunteer &&
      donation.assignedVolunteer._id.toString() === req.user._id.toString();

    if (!isDonor && !isNGO && !isVolunteer && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Not authorized to view this tracking'
      });
    }

    res.json(donation);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createDonation,
  getDonations,
  updateDonation,
  assignVolunteer,
  updateDeliveryStatus,
  getDonationTracking
};