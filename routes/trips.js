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
      fastTagAmount
    } = req.body;

    // Validate truck existence
    const truck = await Truck.findById(truckId);
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }

    // Calculate balance amount
    const balanceAmount =
      freightAmount -
      (loadingAmount +
        unloadingAmount +
        driverBeta +
        dieselAmount +
        oilAmount +
        fastTagAmount +
        advanceAmount);

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
      balanceAmount
    });

    await trip.save();
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});