import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  // store logged-in doctor/admin id for offline emit
  const [userId, setUserId] = useState(null);

  // Extract id from token safely (runs once + when tokens change)
  useEffect(() => {
    try {
      const token = dToken || aToken;
      if (!token) {
        setUserId(null);
        return;
      }

      // JWT payload is base64url; atob may fail on base64url in some cases
      // This is a safer approach for typical JWTs
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));

      setUserId(payload?.id || null);
    } catch (e) {
      console.warn("Failed to parse token payload:", e);
      setUserId(null);
    }
  }, [dToken, aToken]);

  const logout = () => {
    // Notify backend before clearing tokens (best-effort)
    if (userId) {
      // Keep your original event name; if your backend uses a different one, tell me.
      socket.emit("DoctorOffline", userId);
    }

    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }

    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }

    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-blue-900 text-white">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-3">
          {/* Left: Brand + role */}
          <div className="min-w-0 flex items-center gap-2 sm:gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm sm:text-base font-semibold leading-tight">
                {aToken ? "Admin Portal" : "Doctor Portal"}
              </div>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-white/30 px-2 py-0.5 text-[11px] sm:text-xs">
                  {aToken ? "Admin" : "Doctor"}
                </span>

                {/* Optional: show a short id hint on desktop only */}
                {userId ? (
                  <span className="hidden sm:inline text-xs text-white/70 truncate max-w-[220px]">
                    ID: <span className="font-mono">{userId}</span>
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right: Logout button */}
          <button
            onClick={logout}
            className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 hover:bg-gray-200 active:scale-[0.98]"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;