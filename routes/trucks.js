const express = require('express');
const router = express.Router();
const Truck = require('../models/Truck');

// Create a new truck
router.post('/', async (req, res) => {
  try {
    const { vehicleNumber } = req.body;

    // Check if truck already exists
    const existing = await Truck.findOne({ vehicleNumber });
    if (existing) {
      return res.status(400).json({ message: 'Truck already exists' });
    }

    const truck = new Truck({ vehicleNumber });
    await truck.save();
    res.status(201).json(truck);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all trucks
router.get('/', async (req, res) => {
  try {
    const trucks = await Truck.find().sort({ vehicleNumber: 1 });
    res.json(trucks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get a single truck by ID
router.get('/:id', async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id);
    if (!truck) return res.status(404).json({ message: 'Truck not found' });
    res.json(truck);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Truck.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Truck.findByIdAndDelete(req.params.id);
    res.json({ message: 'Truck deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;