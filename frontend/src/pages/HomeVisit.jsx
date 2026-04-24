/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { assets } from "../assets/assets";
import Calendar from "react-calendar"; // Import the calendar component
import "react-calendar/dist/Calendar.css"; // Import calendar styles
import ChatBot from "./ChatBot";

const HomeVisit = () => {
  // Example data for the doctor's profile and patient requests
  const doctor = {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    location: "New York, NY",
    experience: "10+ Years",
  };

  const patientRequests = [
    {
      id: 1,
      patientName: "Alice Brown",
      patientContact: "123-456-7890",
      requestedDate: "2025-01-20",
      visitType: "Home Visit",
    },
    {
      id: 2,
      patientName: "Bob Miller",
      patientContact: "987-654-3210",
      requestedDate: "2025-01-21",
      visitType: "Home Visit",
    },
  ];

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [requestsForSelectedDate, setRequestsForSelectedDate] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Filter patient requests based on the selected date
    const requestsForDate = patientRequests.filter(
      (request) =>
        new Date(request.requestedDate).toDateString() === date.toDateString()
    );
    setRequestsForSelectedDate(requestsForDate);
  };

  const handleAccept = (patientId) => {
    alert(`Home visit request for patient ${patientId} accepted.`);
  };

  const handleDecline = (patientId) => {
    alert(`Home visit request for patient ${patientId} declined.`);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg p-8 mt-10">
       <ChatBot />
      {/* Doctor's Profile */}
      <div className="flex items-center mb-8">
        <img
          src={assets.Doctor_Profile} // Placeholder for doctor's image
          alt="Doctor Profile"
          className="w-32 h-32 rounded-full object-cover"
        />
        <div className="ml-6 text-center md:text-left">
          <h1 className="text-3xl font-bold">{doctor.name}</h1>
          <p className="text-gray-600 mt-1">{doctor.specialty}</p>
          <p className="text-gray-500 mt-1">{doctor.location}</p>
          <p className="text-gray-500 mt-1">{doctor.experience}</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Select a Date for Home Visit</h2>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          className="rounded-lg shadow-md"
        />
      </div>

      {/* Patient Requests for Selected Date */}
      {requestsForSelectedDate.length > 0 ? (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">
            Patient Requests for {selectedDate.toDateString()}
          </h2>
          {requestsForSelectedDate.map((request) => (
            <div key={request.id} className="bg-gray-100 p-6 rounded-lg mb-4">
              <p>
                <strong>Patient Name:</strong> {request.patientName}
              </p>
              <p>
                <strong>Contact:</strong> {request.patientContact}
              </p>
              <p>
                <strong>Requested Visit Type:</strong> {request.visitType}
              </p>

              <div className="mt-4 space-x-4">
                <button
                  onClick={() => handleAccept(request.id)}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDecline(request.id)}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No requests for the selected date.</p>
      )}
    </div>
  );
};

export default HomeVisit;
