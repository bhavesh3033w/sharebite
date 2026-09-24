const User = require('../models/User');
const Donation = require('../models/Donation');

// GET PENDING NGO & VOLUNTEER USERS
const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ['ngo', 'volunteer'] },
      verificationStatus: 'Pending'
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// APPROVE / REJECT USER
const updateVerificationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    user.verificationStatus = req.body.verificationStatus;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ADMIN DASHBOARD STATS
const getAdminStats = async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments();

    const deliveredDonations = await Donation.countDocuments({
      status: 'Delivered'
    });

    const pendingDonations = await Donation.countDocuments({
      status: 'Pending'
    });

    const totalUsers = await User.countDocuments();

    const pendingNGOs = await User.countDocuments({
      role: 'ngo',
      verificationStatus: 'Pending'
    });

    const pendingVolunteers = await User.countDocuments({
      role: 'volunteer',
      verificationStatus: 'Pending'
    });

    res.json({
      totalDonations,
      deliveredDonations,
      pendingDonations,
      totalUsers,
      pendingNGOs,
      pendingVolunteers
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ALL DONATIONS FOR ADMIN
const getAdminDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('userId', 'name email')
      .populate('acceptedBy', 'name email')
      .populate('assignedVolunteer', 'name email')
      .sort({ createdAt: -1 });

    res.json(donations);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getPendingUsers,
  updateVerificationStatus,
  getAdminStats,
  getAdminDonations
};