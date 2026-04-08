const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Food', 'Clothes'],
      required: [true, 'Donation type is required'],
    },
    quantity: {
      type: String,
      required: [true, 'Quantity is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    donorName: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
