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
    console.log("Balance: "+balanceAmount+" Profit: "+profitAmount+ "Advance: "+advanceAmount+"Total expense: "+totalExpense);
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

    // Validate truck existence if truckId is provided
    if (truckId) {
      const truck = await Truck.findById(truckId);
      if (!truck) {
        return res.status(404).json({ message: 'Truck not found' });
      }
    }

    // Calculate total expense (excluding advanceAmount)
    const totalExpense =
      (loadingAmount || 0) +
      (unloadingAmount || 0) +
      (driverBeta || 0) +
      (oilAmount || 0) +
      (fastTagAmount || 0) +
      (taxAmount || 0);

    // Calculate balance amount
    const balanceAmount = totalExpense - (advanceAmount || 0);

    // Calculate profit amount
    const profitAmount = (freightAmount || 0) - totalExpense - (dieselAmount || 0);

    // Build update object
    const updateData = {
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
    };

    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedTrip) return res.status(404).json({ message: 'Trip not found' });

    res.json(updatedTrip);
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