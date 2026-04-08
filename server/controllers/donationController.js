const Donation = require('../models/Donation');

// POST /api/donations — Donor creates donation
const createDonation = async (req, res) => {
  try {
    const { type, quantity, address } = req.body;

    if (!type || !quantity || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const donation = await Donation.create({
      type,
      quantity,
      address,
      userId: req.user._id,
      donorName: req.user.name,
    });

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/donations — NGO gets all, Donor gets own
const getDonations = async (req, res) => {
  try {
    let donations;

    if (req.user.role === 'ngo') {
      donations = await Donation.find().sort({ createdAt: -1 }).populate('userId', 'name email');
    } else {
      donations = await Donation.find({ userId: req.user._id }).sort({ createdAt: -1 });
    }

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/donations/:id — NGO updates status
const updateDonation = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    donation.status = status;
    await donation.save();

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDonation, getDonations, updateDonation };
