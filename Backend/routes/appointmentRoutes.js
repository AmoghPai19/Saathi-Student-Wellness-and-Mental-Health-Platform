import express from 'express';
import Appointment from '../models/appointment.js';

const router = express.Router();

// ## ROUTE 1: Book a new appointment
router.post('/', async (req, res) => {
  try {
    // FIXED: Get userName from the request body
    const { userName, counsellorId, userId, date, timeSlot } = req.body;

    const newAppointment = new Appointment({
      userName, // FIXED: Add userName when creating the new appointment
      counsellorId,
      userId,
      date,
      timeSlot
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);

  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Server error while booking appointment." });
  }
});

// ## ROUTE 2: Get all appointments for a specific user
router.get('/user/:userId', async (req, res) => {
  // ... (this route is correct and doesn't need changes)
  try {
    const appointments = await Appointment.find({ userId: req.params.userId });
    if (!appointments) {
      return res.status(404).json({ message: "No appointments found for this user." });
    }
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error while fetching appointments." });
  }
});

export default router;