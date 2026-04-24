import React, { useEffect, useState,useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const SlotBooking = ({ doctorId, userId }) => {
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState({});
  const [bookedSlots, setBookedSlots] = useState([]);
  const { backendUrl } = useContext(AppContext);

  const normalizeBookedFromDoctor = (doctorData) => {
    if (!doctorData?.slots_booked || typeof doctorData.slots_booked !== "object") {
      return [];
    }

    return Object.entries(doctorData.slots_booked).flatMap(([date, times]) => {
      if (!Array.isArray(times)) return [];
      return times.map((time) => ({ date, time }));
    });
  };

  const normalizeBookedFromApi = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.appointments)) return payload.appointments;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  const getPatientId = (slot) => {
    const rawPatientId = slot?.patientId;
    if (!rawPatientId) return "";

    if (typeof rawPatientId === "object") {
      return String(rawPatientId._id || rawPatientId.id || "");
    }

    return String(rawPatientId);
  };

  // 🔹 Get next 7 days
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const toSlotRange = (start, end) => `${start}-${end}`;

  // 🔹 Fetch doctor + appointments
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching doctor info and appointments for doctorId:", doctorId);
        const docRes = await axios.get(`${backendUrl}/api/doctor/${doctorId}`);
        const doctorData = docRes.data?.doctor || null;
        setDoctor(doctorData);

        // Prefer existing booked slots from doctor payload if appointments API is not available.
        let latestBookedSlots = normalizeBookedFromDoctor(doctorData);

        try {
          const apptRes = await axios.get(`${backendUrl}/api/appointments/${doctorId}`);
          const apiBookedSlots = normalizeBookedFromApi(apptRes.data);
          if (apiBookedSlots.length > 0) {
            latestBookedSlots = apiBookedSlots;
          }
        } catch (apptErr) {
          console.warn("Appointments API unavailable, using doctor slots_booked fallback.", apptErr?.message);
        }

        setBookedSlots(latestBookedSlots);
      } catch (err) {
        console.log("API Error:", err);
        setDoctor(null);
        setBookedSlots([]);
      }
    };

    if (doctorId) fetchData();
  }, [doctorId, backendUrl]);

  // 🔹 Generate slots for 7 days directly from availability ranges
  useEffect(() => {
    if (!doctor?.availability) return;

    const days = getNext7Days();
    const slotData = {};

    days.forEach((dateObj) => {
      const dayName = dateObj.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const dateStr = dateObj.toISOString().split("T")[0];

      const availabilityForDay = (doctor?.availability || []).filter(
        (d) => d.day === dayName
      );

      if (availabilityForDay.length > 0) {
        slotData[dateStr] = availabilityForDay.map((entry) =>
          toSlotRange(entry.startTime, entry.endTime)
        );
      }
    });

    setSlots(slotData);
  }, [doctor]);

  // 🔹 Check if slot is booked (SAFE)
  const isBooked = (date, time) => {
    return bookedSlots?.some(
      (slot) => slot.date === date && slot.time === time
    );
  };

  const getBookingForSlot = (date, time) => {
    return bookedSlots?.find(
      (slot) => slot.date === date && slot.time === time
    );
  };

  const isBookedByCurrentUser = (date, time) => {
    const booking = getBookingForSlot(date, time);
    if (!booking || !userId) return false;

    return getPatientId(booking) === String(userId);
  };

  // 🔹 Book slot
  const handleBooking = async (date, time) => {
    try {
      if (!userId) {
        toast.error("Please login first");
        return;
      }

      if (isBooked(date, time)) {
        toast.info("Already booked");
        return;
      }

      await axios.post(`${backendUrl}/api/appointments`, {
        doctorId,
        patientId: userId,
        date,
        time,
        status: "Booked",
      });

      toast.success("Booked successfully");

      // refresh appointments
      const res = await axios.get(`${backendUrl}/api/appointments/${doctorId}`);
      setBookedSlots(normalizeBookedFromApi(res.data));
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Booking failed");
    }
  };

  const handleCancelBooking = async (date, time) => {
    try {
      if (!userId) {
        toast.error("Please login first");
        return;
      }

      await axios.post(`${backendUrl}/api/appointments/cancel`, {
        doctorId,
        patientId: userId,
        date,
        time,
      });

      toast.success("Booking cancelled successfully");

      const res = await axios.get(`${backendUrl}/api/appointments/${doctorId}`);
      setBookedSlots(normalizeBookedFromApi(res.data));
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Cancel failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Slots</h2>

      {Object.keys(slots || {}).length === 0 && (
        <p className="text-gray-500">No slots available</p>
      )}

      {Object.keys(slots || {}).map((date) => (
        <div key={date} className="mb-6">
          <h3 className="font-semibold">{date}</h3>

          <div className="flex flex-wrap gap-2 mt-2">
            {slots?.[date]?.map((time) => {
              const booked = isBooked(date, time);
              const bookedByCurrentUser = isBookedByCurrentUser(date, time);

              let buttonClassName = "bg-green-400 hover:bg-green-500";
              let buttonLabel = time;
              let buttonDisabled = false;
              let onClickHandler = () => handleBooking(date, time);

              if (booked) {
                if (bookedByCurrentUser) {
                  buttonClassName = "bg-amber-500 hover:bg-amber-600 text-white";
                  buttonLabel = `${time} (Cancel)`;
                  onClickHandler = () => handleCancelBooking(date, time);
                } else {
                  buttonClassName = "bg-red-400 cursor-not-allowed text-white";
                  buttonLabel = `${time} (Booked)`;
                  buttonDisabled = true;
                }
              }

              return (
                <button
                  key={time}
                  onClick={onClickHandler}
                  disabled={buttonDisabled}
                  className={`px-3 py-1 rounded ${buttonClassName}`}
                >
                  {buttonLabel}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SlotBooking;