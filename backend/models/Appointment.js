import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // or patient model
    },
    date: {
      type: String, // "2026-04-18"
      required: true,
    },
    time: {
      type: String, // "09:30"
      required: true,
    },
    status: {
      type: String,
      default: "Not Booked",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", AppointmentSchema);