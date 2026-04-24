import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorAppointments = () => {
  const { dToken, backendUrl } = useContext(DoctorContext);

  const [doctorId, setDoctorId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState("");

  useEffect(() => {
    try {
      if (!dToken) {
        setDoctorId("");
        return;
      }

      const tokenParts = dToken.split(".");
      if (tokenParts.length < 2) {
        setDoctorId("");
        return;
      }

      const base64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      setDoctorId(payload?.id || "");
    } catch (error) {
      setDoctorId("");
    }
  }, [dToken]);

  const loadAppointments = async (id = doctorId) => {
    if (!id) return;

    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/appointments/${id}`);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      setAppointments([]);
      toast.error(error.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!doctorId) return;
    loadAppointments(doctorId);
  }, [doctorId, backendUrl]);

  const cancelAppointment = async (appointmentId) => {
    if (!doctorId) {
      toast.error("Doctor id not found");
      return;
    }

    const shouldCancel = window.confirm("Cancel this appointment?");
    if (!shouldCancel) return;

    setCancellingId(appointmentId);
    try {
      const { data } = await axios.post(`${backendUrl}/api/appointments/doctor-cancel`, {
        appointmentId,
        doctorId,
      });

      toast.success(data?.message || "Appointment cancelled");
      await loadAppointments(doctorId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    } finally {
      setCancellingId("");
    }
  };

  return (
    <div className="w-full p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Doctor Appointments</h1>
        <p className="text-sm text-gray-600 mt-1">View your booked appointments and cancel if needed.</p>

        {!doctorId && (
          <div className="mt-4 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
            Unable to identify doctor session. Please login again.
          </div>
        )}

        {loading && <p className="mt-4 text-gray-600">Loading appointments...</p>}

        {!loading && doctorId && appointments.length === 0 && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">
            No appointments booked for this doctor.
          </div>
        )}

        {!loading && appointments.length > 0 && (
          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-700">
                <tr>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => {
                  const patient =
                    appointment?.patientId && typeof appointment.patientId === "object"
                      ? appointment.patientId
                      : null;

                  return (
                    <tr key={appointment._id} className="border-t border-gray-100">
                      <td className="px-4 py-3">{patient?.name || "Unknown"}</td>
                      <td className="px-4 py-3">{patient?.email || "-"}</td>
                      <td className="px-4 py-3">{patient?.phone || "-"}</td>
                      <td className="px-4 py-3">{appointment.date}</td>
                      <td className="px-4 py-3">{appointment.time}</td>
                      <td className="px-4 py-3">{appointment.status || "Booked"}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => cancelAppointment(appointment._id)}
                          disabled={cancellingId === appointment._id}
                          className="rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                          {cancellingId === appointment._id ? "Cancelling..." : "Cancel"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
