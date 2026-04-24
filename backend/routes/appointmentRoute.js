import express from "express";
import Appointment from "../models/Appointment.js";
const router = express.Router();

router.get("/:doctorId", async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.params.doctorId,
    })
      .populate("patientId", "name email phone")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { doctorId, patientId, date, time } = req.body;

    if (!doctorId || !patientId || !date || !time) {
      return res.status(400).json({ message: "doctorId, patientId, date and time are required" });
    }

    // prevent double booking
    const exists = await Appointment.findOne({ doctorId, date, time });

    if (exists) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const appointment = new Appointment(req.body);
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Failed to create appointment" });
  }
});

router.post("/cancel", async (req, res) => {
  try {
    const { doctorId, patientId, date, time } = req.body;

    if (!doctorId || !patientId || !date || !time) {
      return res.status(400).json({ message: "doctorId, patientId, date and time are required" });
    }

    const cancelledAppointment = await Appointment.findOneAndDelete({
      doctorId,
      patientId,
      date,
      time,
    });

    if (!cancelledAppointment) {
      return res.status(404).json({ message: "No booking found for this user on selected slot" });
    }

    return res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to cancel appointment" });
  }
});

router.post("/doctor-cancel", async (req, res) => {
  try {
    const { appointmentId, doctorId } = req.body;

    if (!appointmentId || !doctorId) {
      return res
        .status(400)
        .json({ message: "appointmentId and doctorId are required" });
    }

    const cancelledAppointment = await Appointment.findOneAndDelete({
      _id: appointmentId,
      doctorId,
    });

    if (!cancelledAppointment) {
      return res
        .status(404)
        .json({ message: "Appointment not found for this doctor" });
    }

    return res.json({
      success: true,
      message: "Appointment cancelled by doctor successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to cancel appointment" });
  }
});

export default router;
