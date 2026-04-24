"use client";
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import RelatedDoctors from "../components/RelatedDoctors";
import socket from "../socket";
import VideoCall from "./VideoCall";
import { toast } from "react-toastify";
import { FaPhone } from "react-icons/fa";
import { assets } from "../assets/assets";
import ChatBot from "./ChatBot";
import SlotBooking from "../components/SlotBooking";

const Appointment = () => {
  const { docId } = useParams();
  const { backendUrl } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [calling, setCalling] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [callId, setCallId] = useState(null);
  const [patientId, setPatientId] = useState(null);

  // Get logged-in patient id from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setPatientId(payload.id);
    }
  }, []);

  // Register patient on socket
  useEffect(() => {
    if (!patientId) return;
    socket.emit("registerPatient", patientId);

    const handleCallAccepted = (data) => {
      console.log("callAccepted received", data);
      setCalling(false);
      setCallId(data.callId);
      setShowVideoCall(true);
    };

    socket.on("callAccepted", handleCallAccepted);

    return () => {
      socket.off("callAccepted", handleCallAccepted);
    };
  }, [patientId]);

// timeout for doctor to answer
  useEffect(() => {
    const handleNoAnswer = ({ data }) => {
        setCalling(false);
        toast.error("Doctor did not responded. Please try again later.");
    };
    socket.on("callNoAnswer", handleNoAnswer);
    return () => socket.off("callNoAnswer", handleNoAnswer);
  }, [docInfo]);

  // rejected by doctor notification
  useEffect(() => {
    const handlerejectCall = () => {
        setCalling(false);
        toast.error("Call rejected by doctor. Please try again later.");
    };
    socket.on("callRejected", handlerejectCall);
    return () => socket.off("callRejected", handlerejectCall);
  }, [docInfo]);




  // Call failed notification
  useEffect(() => {
    const handleCallFailed = (data) => {
      toast.error(data.reason);
      setCalling(false);
    };
    socket.on("callFailed", handleCallFailed);
    return () => socket.off("callFailed", handleCallFailed);
  }, []);

  // Fetch doctor info
  useEffect(() => {
    const fetchDocInfo = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/doctor/${docId}`);
        const doctor = await response.json();
        setDocInfo(doctor.doctor);
      } catch (err) {
        console.error(err);
      }
    };
    if (docId) fetchDocInfo();
  }, [docId, backendUrl]);



  const callDoctor = () => {
    if (!patientId) {
      alert("User not logged in");
      return;
    }
    if (!docInfo) return;

    setCalling(true);
    socket.emit("callDoctor", { doctorId: docInfo._id, patientId });
  };

  return (
    <div>
       <ChatBot />
      {/* Calling popup */}
      {calling && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <p className="text-lg font-semibold">Calling Doctor...</p>
          </div>
        </div>
      )}

      {/* Video call */}
      {showVideoCall && docInfo && (
        <VideoCall doctorId={docInfo._id} patientId={patientId} callId={callId} onEndCall={() => setShowVideoCall(false)} />
      )}

      {/* Doctor Info */}
      {docInfo ? (
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img className="bg-blue-300 w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt={docInfo.name} />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white">
            <div className="flex justify-between">
              <p className="flex items-center gap-2 text-2xl font-medium">
                {docInfo.name} <img className="w-5" src={assets.verified_icon} alt="verified" />
              </p>
              <button
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl"
                onClick={callDoctor}
              >
                <FaPhone /> Start Video Call
              </button>
            </div>
            <p className="mt-2 text-gray-600">
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <p className="mt-4 text-gray-500">
              Appointment fee: <span className="text-gray-700">${docInfo.fees}</span>
            </p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {/* Slots */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking Slots</p>
        <SlotBooking doctorId={docId} userId={patientId} />
      </div>

      {docInfo && <RelatedDoctors docId={docId} speciality={docInfo.speciality} />}
    </div>
  );
};

export default Appointment;