/* eslint-disable no-unused-vars */
"use client";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ChatBot from "./ChatBot";

function TopDoctors() {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(backendUrl + "/api/doctor/list");
        const data = await res.json();

        if (data.success) {
          setDoctors(data.doctors);
          setMessage("");
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage(
          error.message || "Failed to fetch doctors data. Please try again later."
        );
      }
    };

    fetchDoctors();
  }, [backendUrl]);

  return (
    <div className="p-6">
       <ChatBot />
      <h1 className="text-2xl font-semibold mb-2 text-center">
        Book Your Appointment According To Your Need
      </h1>

      <p className="text-gray-600 mb-6 text-center">
        Simply browse through our extensive list of trusted doctors.
      </p>

      {message && <p className="text-red-500 text-center">{message}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {doctors.map((item) => (
          <div
            key={item._id}
            onClick={() => navigate(`/appointment/${item._id}`)}
            className="bg-white p-4 shadow-md rounded-lg cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-60 bg-blue-200 object-cover rounded-md"
            />

            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <p className="w-3 h-3 bg-green-500 rounded-full"></p>
                <p className="text-green-600 font-medium">Available</p>
              </div>

              <div className="mt-2">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-gray-500">{item.speciality}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopDoctors;