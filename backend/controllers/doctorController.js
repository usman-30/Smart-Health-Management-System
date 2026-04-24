import doctorModel from "../models/Doctor.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Availablity Changed" });
  } catch (error) {
   
    res.json({ success: false, message: error.message });
  }
};
const doctorList = async (req, res) => {
  try {
  
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const doctorDetails = async (req, res) => {
  try {
    const { docId } = req.params;
    const doctor = await doctorModel.findById(docId).select("-password");
    res.json({ success: true, doctor });
  }
  catch (error) {
    res.json({ success: false, message: error.message });
  }
}

const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if(!doctor && doctor.length === 0){
      return res.json({ success: false, message: "Email not found" });
    }
const isMatch = await bcrypt.compare(password,doctor.password)
    if (isMatch) {
       const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: "true", token });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    }
   catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// 🔹 Helper: Validate time format (HH:MM)
const isValidTime = (time) => {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};

// 🔹 Allowed days
const validDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// 🔹 Controller
export const setDoctorAvailability = async (req, res) => {
  try {
    const { doctorId, availability } = req.body;

    console.log("Received availability update:", { doctorId, availability });

    // 🔹 Basic validation 
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    if (!availability || !Array.isArray(availability)) {
      return res.status(400).json({
        success: false,
        message: "Availability must be an array",
      });
    }

    if (availability.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one availability entry is required",
      });
    }

    const cleanedAvailability = [];

    for (let i = 0; i < availability.length; i++) {
      const item = availability[i];
      const { day, startTime, endTime } = item;

      // 🔹 Missing fields
      if (!day || !startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: `Row ${i + 1}: All fields (day, startTime, endTime) are required`,
        });
      }

      // 🔹 Invalid day
      if (!validDays.includes(day)) {
        return res.status(400).json({
          success: false,
          message: `Row ${i + 1}: Invalid day "${day}"`,
        });
      }

      // 🔹 Invalid time format
      if (!isValidTime(startTime) || !isValidTime(endTime)) {
        return res.status(400).json({
          success: false,
          message: `Row ${i + 1}: Time must be in HH:MM format`,
        });
      }

      // 🔹 Logical error
      if (startTime >= endTime) {
        return res.status(400).json({
          success: false,
          message: `Row ${i + 1} (${day}): Start time must be earlier than end time`,
        });
      }

      cleanedAvailability.push({
        day,
        startTime,
        endTime,
      });
    }

    

    // 🔹 Update doctor
    const doctor = await doctorModel.findByIdAndUpdate(
      doctorId,
      { availability: cleanedAvailability },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: doctor.availability,
    });
  } catch (error) {
    console.error("Set Availability Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};


export const getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    console.log("Fetching availability for doctorId:", doctorId);
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID required",
      });
    }

    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    console.log("Fetched availability for doctorId:", doctorId, doctor.availability);
    return res.status(200).json({
      success: true,
      availability: doctor.availability || [],
    });
  } catch (error) {
    console.log("Get Availability Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export { changeAvailability, doctorList,doctorDetails, doctorLogin };
