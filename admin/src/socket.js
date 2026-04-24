import { io } from "socket.io-client";

// Create a socket instance without auto-connecting so we can attach auth data at runtime.
const socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ["websocket"],
    autoConnect: false,
});

socket.on("connect_error", (err) => {
    console.error("Socket connect error:", err);
});

export default socket;