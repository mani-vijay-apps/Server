const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Truck = require('../models/Truck');

// Create a new trip
router.post('/', async (req, res) => {
  try {
    const {
      truckId,
      date,
      destination,
      freightPerTon,
      freightAmount,
      loadingAmount,
      unloadingAmount,
      driverBeta,
      advanceAmount,
      dieselAmount,
      oilAmount,
      fastTagAmount,
      taxAmount
    } = req.body;

    // Validate truck existence
    const truck = await Truck.findById(truckId);
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }

    // Calculate total expense (excluding advanceAmount)
    const totalExpense =
      loadingAmount +
      unloadingAmount +
      driverBeta +
      oilAmount +
      fastTagAmount +
      taxAmount;

    // Calculate balance amount
    const balanceAmount = totalExpense - advanceAmount;
    const profitAmount = freightAmount - totalExpense - dieselAmount;

    const trip = new Trip({
      truck: truckId,
      date,
      destination,
      freightPerTon,
      freightAmount,
      loadingAmount,
      unloadingAmount,
      driverBeta,
      advanceAmount,
      dieselAmount,
      oilAmount,
      fastTagAmount,
      taxAmount,
      totalExpense,
      balanceAmount,
      profitAmount
    });

    await trip.save();
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
 
// Get all trips
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find().populate('truck', 'vehicleNumber driverName');
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get a single trip by ID
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('truck', 'vehicleNumber driverName');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update a trip
router.put('/:id', async (req, res) => {
  try {
    const {
      loadingAmount,
      unloadingAmount,
      driverBeta,
      dieselAmount,
      oilAmount,
      fastTagAmount,
      taxAmount,
      advanceAmount
    } = req.body;

    // Recalculate totalExpense and balanceAmount if relevant fields are present
    let totalExpense = null;
    let balanceAmount = null;
    let profitAmount = null;
    if (
      loadingAmount !== undefined &&
      unloadingAmount !== undefined &&
      driverBeta !== undefined &&
      dieselAmount !== undefined &&
      oilAmount !== undefined &&
      fastTagAmount !== undefined &&
      taxAmount !== undefined &&
      advanceAmount !== undefined
    ) {
      totalExpense =
        loadingAmount +
        unloadingAmount +
        driverBeta +
        oilAmount +
        fastTagAmount +
        taxAmount;

      balanceAmount = totalExpense - advanceAmount;
      profitAmount = freightAmount - totalExpense - dieselAmount;

      req.body.totalExpense = totalExpense;
      req.body.balanceAmount = balanceAmount;
      req.body.profitAmount = profitAmount;
    }

    const updated = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete a trip
router.delete('/:id', async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;