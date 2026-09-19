
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    // NGO Acceptance Details
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    acceptedAt: {
      type: Date
    },

    // Volunteer Assignment Details
    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    assignedAt: {
      type: Date
    },

    // Delivery Completion Details
    deliveredAt: {
      type: Date
    },

    deliveryNotes: {
      type: String,
      trim: true
    },

    // Donation Information
    type: {
      type: String,
      enum: ['Food', 'Clothes'],
      required: [true, 'Donation type is required']
    },

    quantity: {
      type: String,
      required: [true, 'Quantity is required'],
      trim: true
    },

    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },

    // Donation Status
    status: {
      type: String,
      enum: [
        'Pending',
        'Accepted',
        'Rejected',
        'Volunteer Assigned',
        'Pickup Started',
        'Picked Up',
        'Out for Delivery',
        'Delivered',
        'Cancelled'
      ],
      default: 'Pending'
    },

    // Donor Information
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    donorName: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Donation', donationSchema);