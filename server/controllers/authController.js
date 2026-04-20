const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// SIGNUP
const signup = async (req, res) => {
  try {
    console.log(req.body);

    const {
      name,
      email,
      password,
      role,
      ngoCertificate,
      idProofType
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      ngoCertificate,
      idProofType,
      verificationStatus: role === 'donor' ? 'Approved' : 'Pending'
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      ngoCertificate: user.ngoCertificate,
      idProofType: user.idProofType,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // BLOCK PENDING
    if (user.role !== 'admin' && user.verificationStatus === 'Pending') {
      return res.status(403).json({
        message: 'Your account is pending admin approval'
      });
    }

    // BLOCK REJECTED
    if (user.role !== 'admin' && user.verificationStatus === 'Rejected') {
      return res.status(403).json({
        message: 'Your account was rejected by admin'
      });
    }

    // APPROVED USERS LOGIN
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      ngoCertificate: user.ngoCertificate,
      idProofType: user.idProofType,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  signup,
  login
};