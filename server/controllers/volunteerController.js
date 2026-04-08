const Volunteer = require('../models/Volunteer');

// POST /api/volunteers
const registerVolunteer = async (req, res) => {
  try {
    const { name, skills, contact } = req.body;

    if (!name || !skills || !contact) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const volunteer = await Volunteer.create({
      name,
      skills,
      contact,
      userId: req.user._id,
    });

    res.status(201).json(volunteer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/volunteers — NGO only
const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerVolunteer, getVolunteers };
