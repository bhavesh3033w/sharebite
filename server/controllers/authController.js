const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};


// =========================
// SIGNUP
// =========================
const signup = async (req, res) => {
  try {
    console.log(req.body);

    const {
      name,
      email,
      password,
      role,
      ngoCertificate,
      idProofType,
      idProof
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    // CHECK EXISTING USER
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    // CREATE USER
    const user = await User.create({
      name,
      email,
      password,
      role,

      // NGO DOCUMENT
      ngoCertificate: ngoCertificate || '',

      // VOLUNTEER DOCUMENT
      idProofType: idProofType || '',
      idProof: idProof || '',

      // DONOR = APPROVED
      // NGO / VOLUNTEER = PENDING
      verificationStatus:
        role === 'donor'
          ? 'Approved'
          : 'Pending'
    });

    // RESPONSE
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,

      ngoCertificate: user.ngoCertificate,

      idProofType: user.idProofType,
      idProof: user.idProof,

      token: generateToken(user._id)
    });

  } catch (error) {
    console.error('Signup Error:', error);

    res.status(500).json({
      message: error.message
    });
  }
};


// =========================
// LOGIN
// =========================
const login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // FIND USER
    const user = await User.findOne({ email });

    if (
      !user ||
      !(await user.matchPassword(password))
    ) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }


    // =========================
    // BLOCK PENDING USERS
    // =========================
    if (
      user.role !== 'admin' &&
      user.verificationStatus === 'Pending'
    ) {
      return res.status(403).json({
        message:
          'Your account is pending admin approval'
      });
    }


    // =========================
    // BLOCK REJECTED USERS
    // =========================
    if (
      user.role !== 'admin' &&
      user.verificationStatus === 'Rejected'
    ) {
      return res.status(403).json({
        message:
          'Your account was rejected by admin'
      });
    }


    // =========================
    // APPROVED USER LOGIN
    // =========================
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus:
        user.verificationStatus,

      ngoCertificate:
        user.ngoCertificate,

      idProofType:
        user.idProofType,

      idProof:
        user.idProof,

      token: generateToken(user._id)
    });

  } catch (error) {
    console.error('Login Error:', error);

    res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {
  signup,
  login
};