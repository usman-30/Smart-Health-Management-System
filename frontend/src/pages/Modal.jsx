import { useState } from "react";
import ChatBot from "./ChatBot";
const Modal = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, name: "Muzammil", date: "27 January", accepted: null },
    { id: 2, name: "Warasat", date: "28 January", accepted: null },
    { id: 3, name: "Unknown", date: "29 January", accepted: null },
  ]);

  const [showModal, setShowModal] = useState(false);

  const handleDecision = (id, decision) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, accepted: decision }
          : appointment
      )
    );

    const appointment = appointments.find(
      (appointment) => appointment.id === id
    );
    if (appointment) {
      alert(
        `${appointment.name}'s appointment on ${appointment.date} has been ${
          decision ? "accepted" : "rejected"
        }!`
      );
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="border border-black px-4 py-2 text-white bg-blue-900 hover:bg-gray-400 hover:text-black"
      >
        Check Appointment List
      </button>
 <ChatBot />
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Appointment Requests</h2>
            <ul>
              {appointments.map((appointment) => (
                <li key={appointment.id} className="mb-4">
                  <p>
                    <strong>{appointment.name}</strong> wants an appointment on{" "}
                    {appointment.date}.
                  </p>
                  <div className="flex justify-end space-x-4 mt-2">
                    <button
                      onClick={() => handleDecision(appointment.id, true)}
                      disabled={appointment.accepted !== null}
                      className={`px-4 py-2 rounded ${
                        appointment.accepted === true
                          ? "bg-green-300 text-white cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecision(appointment.id, false)}
                      disabled={appointment.accepted !== null}
                      className={`px-4 py-2 rounded ${
                        appointment.accepted === false
                          ? "bg-red-300 text-white cursor-not-allowed"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-gray-400 text-black rounded hover:bg-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
