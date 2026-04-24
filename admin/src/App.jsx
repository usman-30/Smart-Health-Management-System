/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";


// Doctor Pages

import Chat from "./pages/Doctor/Chat";
import DoctorAppointments from "./pages/Doctor/Appointments";

const App = () => {

  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
console.log("Admin Token:", aToken);
console.log("Doctor Token:", dToken);
  // Admin Panel
  if (aToken) {
    return (
      <div>
        <Navbar />
        <ToastContainer />

        <div className="flex items-start">
          <Sidebar />

          <Routes>
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/all-appointments" element={<AllAppointments />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/doctor-list" element={<DoctorsList />} />
          </Routes>

        </div>
      </div>
    );
  }

  // Doctor Panel
  if (dToken) {
    return (
      <div>
        <Navbar />
        <ToastContainer />

        <div className="flex items-start">
          <Sidebar />

         <Routes>
          <Route path="/" element={<DoctorAppointments />} />
          <Route path="/doctor-appointments" element={<DoctorAppointments />} />
            <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="/doctor-appointments" replace />} />
          </Routes>

        </div>
      </div>
    );
  }

  // Login Page
  return (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;