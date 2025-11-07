const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  truck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Truck',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  freightPerTon: {
    type: Number,
    required: true
  },
  freightAmount: {
    type: Number,
    required: true
  },
  loadingAmount: {
    type: Number,
    required: true
  },
  unloadingAmount: {
    type: Number,
    required: true
  },
  driverBeta: {
    type: Number,
    required: true
  },
  advanceAmount: {
    type: Number,
    required: true
  },
  dieselAmount: {
    type: Number,
    required: true
  },
  oilAmount: {
    type: Number,
    required: true
  },
  fastTagAmount: {
    type: Number,
    required: true
  },
  totalExpense: {
    type: Number,
    required: true
  },
  balanceAmount: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);