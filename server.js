const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

//  CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow frontend domain or fallback to all
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

//  Middleware
app.use(express.json());

//  MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' Connected to MongoDB'))
.catch(err => console.error(' MongoDB connection error:', err));

//  Routes
app.use('/api/trucks', require('./routes/trucks'));
app.use('/api/trips', require('./routes/trips'));

//  Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));