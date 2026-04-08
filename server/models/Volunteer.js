const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    skills: {
      type: String,
      required: [true, 'Skills are required'],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, 'Contact is required'],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Volunteer', volunteerSchema);
