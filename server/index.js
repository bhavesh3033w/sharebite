const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS (Temporary wildcard for debugging)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// ROOT
app.get("/", (req, res) => {
  res.send("🚀 ShareBite Backend is Running");
});

// ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/admin', require('./routes/admin'));

// NEW MULTER UPLOAD ROUTE
app.use('/api/upload', require('./routes/upload'));

// OPTIONAL: serve uploaded files
app.use('/uploads', express.static('uploads'));

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ShareBite API running',
    timestamp: new Date()
  });
});

// DATABASE
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sharebite';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });