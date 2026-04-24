import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import crypto from "crypto";

import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import appointmentRouter from "./routes/appointmentRoute.js";
import chatRouter from "./routes/chatRoute.js";

dotenv.config();
connectDB();
connectCloudinary();

const app = express();
const server = http.createServer(app);

// userId -> Set(socketId)
const users = new Map();
// socketId -> userId
const socketToUser = new Map();

// callId -> { patientId, doctorId, patientSocketId, doctorSocketId }
const calls = new Map();

const allowedOrigins = [
  process.env.CLIENT_URL1,
  process.env.CLIENT_URL2,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins.length ? allowedOrigins : ["*"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

function addUserSocket(userId, socketId) {
  if (!users.has(userId)) users.set(userId, new Set());
  users.get(userId).add(socketId);
  socketToUser.set(socketId, userId);
}

function removeSocket(socketId) {
  const userId = socketToUser.get(socketId);
  if (!userId) return { userId: null, wentOffline: false };

  socketToUser.delete(socketId);

  const set = users.get(userId);
  if (!set) return { userId, wentOffline: false };

  set.delete(socketId);
  if (set.size === 0) {
    users.delete(userId);
    return { userId, wentOffline: true };
  }
  return { userId, wentOffline: false };
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("registerDoctor", (doctorId) => {
    addUserSocket(doctorId, socket.id);
    console.log("Doctor registered:", doctorId, socket.id);
  });

  socket.on("DoctorOffline", (doctorId) => {
    const doctorSockets = users.get(doctorId);
    if (doctorSockets) {
      for (const sId of doctorSockets) {
        io.to(sId).emit("forceOffline");
        removeSocket(sId);
      }
    }
    console.log(`Doctor ${doctorId} went offline`);
  });

  socket.on("registerPatient", (patientId) => {
    addUserSocket(patientId, socket.id);
    console.log("Patient registered:", patientId, socket.id);
  });
     
  // Patient calls doctor => create callId and notify doctor sockets
  const RING_TIMEOUT_MS = 30_000; // 30s
  socket.on("callDoctor", ({ doctorId, patientId }) => {
    const doctorSockets = users.get(doctorId);

    if (!doctorSockets || doctorSockets.size === 0) {
      socket.emit("callFailed", { reason: "Doctor is currently offline" });
      return;
    }

    const callId = crypto.randomUUID();

    const call = {
      callId,
      patientId,
      doctorId,
      patientSocketId: socket.id,
      doctorSocketId: null,
      status: "ringing",
      ringTimeout: null,
    };

    // start ring timeout
    call.ringTimeout = setTimeout(() => {
      const c = calls.get(callId);
      if (!c) return;

      // only timeout if still ringing
      if (c.status === "ringing") {
        io.to(c.patientSocketId).emit("callNoAnswer", {
          callId,
          reason: "Doctor is not responding",
        });

        // stop ringing on doctor side too
        const ds = users.get(c.doctorId);
        if (ds) for (const sId of ds) io.to(sId).emit("callEnded", { callId });

        calls.delete(callId);
        console.log(`Call ${callId} timed out (no answer)`);
      }
    }, RING_TIMEOUT_MS);

    calls.set(callId, call);

    for (const sId of doctorSockets) {
      io.to(sId).emit("incomingCall", { callId, doctorId, patientId });
    }

    console.log(
      `Call request ${callId} from patient ${patientId} to doctor ${doctorId}`,
    );
  });

  // Doctor accepts => lock this call to THIS doctor socket only
  socket.on("acceptCall", ({ callId }) => {
    const call = calls.get(callId);
    if (!call) return;

    // Only the intended doctor can accept
    // (you can harden this by verifying socketToUser.get(socket.id) === call.doctorId)
    call.doctorSocketId = socket.id;
    calls.set(callId, call);

    io.to(call.patientSocketId).emit("callAccepted", { callId });

    console.log(`Doctor accepted call ${callId}, doctorSocketId=${socket.id}`);
  });

  socket.on("rejectCall", ({ callId }) => {
    const call = calls.get(callId);
    if (!call) return;
    io.to(call.patientSocketId).emit("callRejected", { callId });
    calls.delete(callId);
    console.log(`Call ${callId} rejected`);
  });

  // Single signaling event: forward only to the other side of this callId
  socket.on("webrtcSignal", ({ callId, signal }) => {
    const call = calls.get(callId);
    if (!call) return;

    const fromSocketId = socket.id;

    // Determine target socket
    let targetSocketId = null;
    if (fromSocketId === call.patientSocketId) {
      targetSocketId = call.doctorSocketId; // might be null until accepted
    } else if (fromSocketId === call.doctorSocketId) {
      targetSocketId = call.patientSocketId;
    } else {
      // Not a participant of this call => ignore
      return;
    }

    if (!targetSocketId) return;

    io.to(targetSocketId).emit("webrtcSignal", { callId, signal });
  });

  // Optional: end call cleanup
  socket.on("endCall", ({ callId }) => {
    const call = calls.get(callId);
    if (!call) return;

    const other =
      socket.id === call.patientSocketId
        ? call.doctorSocketId
        : socket.id === call.doctorSocketId
          ? call.patientSocketId
          : null;

    if (other) io.to(other).emit("callEnded", { callId });

    calls.delete(callId);
    console.log(`Call ${callId} ended`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // If socket is part of any call, notify the other side and cleanup
    for (const [callId, call] of calls.entries()) {
      if (
        call.patientSocketId === socket.id ||
        call.doctorSocketId === socket.id
      ) {
        const other =
          call.patientSocketId === socket.id
            ? call.doctorSocketId
            : call.patientSocketId;
        if (other) io.to(other).emit("callEnded", { callId });
        calls.delete(callId);
      }
    }

    const { userId, wentOffline } = removeSocket(socket.id);
    if (userId && wentOffline) {
      io.emit("userOffline", { userId });
      console.log(`User ${userId} is now offline`);
    }
  });
});

// Middleware
app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : ["*"],
    credentials: true,
  }),
);
app.use(express.json({ strict: false }));
app.use(cookieParser());

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export { io };
