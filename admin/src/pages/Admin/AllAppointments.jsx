/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";

const DoctorAvailabilityAdmin = () => {
  const { backendUrl, aToken } = useContext(AdminContext);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [availability, setAvailability] = useState([]);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch doctors
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/doctor/list`, {
        headers: { Authorization: aToken },
      });
      setDoctors(res.data.doctors || []);
    } catch (err) {
      setErrorMsg("Failed to load doctors");
    }
  };

  // 🔹 Fetch availability
  const fetchAvailability = async (doctorId) => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/admin/availability/${doctorId}`,
        {
          headers: { Authorization: aToken },
        }
      );
      console.log("Fetched availability:", res.data);
      setAvailability(res.data.availability || []);
    } catch (err) {
      setErrorMsg("Failed to load schedule");
    }
  };

  const handleDoctorChange = (doctorId) => {
    setSelectedDoctor(doctorId);
    setErrorMsg("");
    setSuccessMsg("");
    fetchAvailability(doctorId);
  };

  const addRow = () => {
    setAvailability([
      ...availability,
      { day: "Monday", startTime: "", endTime: "" },
    ]);
  };

  const deleteRow = (index) => {
    const updated = availability.filter((_, i) => i !== index);
    setAvailability(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  // 🔹 Frontend validation
  const validateBeforeSubmit = () => {
    for (let i = 0; i < availability.length; i++) {
      const { day, startTime, endTime } = availability[i];

      if (!day || !startTime || !endTime) {
        return `Row ${i + 1}: All fields are required`;
      }

      if (startTime >= endTime) {
        return `Row ${i + 1}: Start time must be before end time`;
      }
    }
    return null;
  };

  // 🔹 Save
 const saveAvailability = async () => {
  setErrorMsg("");
  setSuccessMsg("");

  if (!selectedDoctor) {
    setErrorMsg("Please select a doctor");
    return;
  }

  const validationError = validateBeforeSubmit();
  if (validationError) {
    setErrorMsg(validationError);
    return;
  }

  try {
    setLoading(true);
    const res = await axios.post(
      `${backendUrl}/api/admin/set-availability`,
      {
        doctorId: selectedDoctor,
        availability,
      }, 
      {
        headers: {aToken }, // ✅ FIXED
      }
    );

    console.log("Response:", res.data);

    // 🔴 IMPORTANT CHECK
    if (!res.data.success) {
      throw new Error(res.data.message);
    }

    setSuccessMsg(res.data.message || "Saved successfully");
  } catch (err) {
    console.log("ERROR:", err);

    setErrorMsg(
      err.response?.data?.message || err.message || "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Admin - Doctor Schedule Manager
      </h2>

      {/* 🔹 Alerts */}
      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-3 mb-3 rounded">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-100 text-green-700 p-3 mb-3 rounded">
          {successMsg}
        </div>
      )}

      {/* 🔹 Select Doctor */}
      <select
        className="border p-2 w-full mb-4"
        value={selectedDoctor}
        onChange={(e) => handleDoctorChange(e.target.value)}
      >
        <option value="">-- Select Doctor --</option>
        {doctors.map((doc) => (
          <option key={doc._id} value={doc._id}>
            {doc.name} ({doc.degree})
          </option>
        ))}
      </select>

      {!selectedDoctor && <p>Please select a doctor</p>}

      {selectedDoctor && (
        <>
          {availability.length === 0 && (
            <p className="mb-3">No schedule found. Add one.</p>
          )}

          {availability.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 mb-3 items-center border p-2 rounded"
            >
              <select
                className="border p-2"
                value={item.day}
                onChange={(e) =>
                  handleChange(index, "day", e.target.value)
                }
              >
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
              </select>

              <input
                type="time"
                className="border p-2"
                value={item.startTime}
                onChange={(e) =>
                  handleChange(index, "startTime", e.target.value)
                }
              />

              <input
                type="time"
                className="border p-2"
                value={item.endTime}
                onChange={(e) =>
                  handleChange(index, "endTime", e.target.value)
                }
              />

              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => deleteRow(index)}
              >
                Delete
              </button>
            </div>
          ))}

          <div className="mt-4">
            <button
              className="bg-blue-500 text-white p-2 mr-3 rounded"
              onClick={addRow}
            >
              Add Day
            </button>

            <button
              className={`p-2 rounded text-white ${
                loading ? "bg-gray-400" : "bg-green-600"
              }`}
              onClick={saveAvailability}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Schedule"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorAvailabilityAdmin;