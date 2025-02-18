const { validationResult } = require('express-validator');
const Desk = require('../models/Desk');

// Create a new desk
const createDesk = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const desk = new Desk(req.body);
    await desk.save();
    res.status(201).json({ message: 'Desk created successfully', desk });
  } catch (error) {
    res.status(500).json({ message: 'Error creating desk', error: error.message });
  }
};

// Get all desks
const getAllDesks = async (req, res) => {
  try {
    const desks = await Desk.find();
    res.json(desks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching desks', error: error.message });
  }
};

// Get a desk by ID
const getDeskById = async (req, res) => {
  try {
    const desk = await Desk.findById(req.params.id);
    if (!desk) return res.status(404).json({ message: 'Desk not found' });

    res.json(desk);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching desk', error: error.message });
  }
};

// Update a desk
const updateDesk = async (req, res) => {
  try {
    const desk = await Desk.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!desk) return res.status(404).json({ message: 'Desk not found' });

    res.json({ message: 'Desk updated successfully', desk });
  } catch (error) {
    res.status(500).json({ message: 'Error updating desk', error: error.message });
  }
};

// Delete a desk
const deleteDesk = async (req, res) => {
  try {
    const desk = await Desk.findByIdAndDelete(req.params.id);
    if (!desk) return res.status(404).json({ message: 'Desk not found' });

    res.json({ message: 'Desk deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting desk', error: error.message });
  }
};

module.exports = {
  createDesk,
  getAllDesks,
  getDeskById,
  updateDesk,
  deleteDesk
};
