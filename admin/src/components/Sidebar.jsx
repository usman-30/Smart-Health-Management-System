/* eslint-disable no-unused-vars */
import React, { useContext, useMemo, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const linkBase =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors";
const linkInactive = "text-gray-700 hover:bg-white hover:text-blue-700";
const linkActive = "bg-blue-900 text-white";

const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `${linkBase} ${isActive ? linkActive : linkInactive}`
    }
  >
    <img src={icon} alt="" className="w-5 h-5 shrink-0" />
    <span className="truncate">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  const isAdmin = !!aToken;
  const isDoctor = !!dToken;

  const items = useMemo(() => {
    if (isAdmin) {
      return [
        { to: "/admin-dashboard", icon: assets.home_icon, label: "Dashboard" },
        { to: "/all-appointments", icon: assets.appointment_icon, label: "Appointments" },
        { to: "/add-doctor", icon: assets.add_icon, label: "Add Doctor" },
        { to: "/doctor-list", icon: assets.people_icon, label: "Doctors List" },
      ];
    }
    if (isDoctor) {
      return [
        { to: "/doctor-appointments", icon: assets.appointment_icon, label: "Appointments" },
        { to: "/chat", icon: assets.home_icon, label: "Chat" },
      ];
    }
    return [];
  }, [isAdmin, isDoctor]);

  // Mobile drawer state
  const [open, setOpen] = useState(false);

  if (!isAdmin && !isDoctor) return null;

  return (
    <>
      {/* Mobile top bar button (only on small screens) */}
      <div className="sm:hidden sticky top-0 z-40 bg-white border-b px-3 py-2 flex items-center justify-between">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-blue-900 text-white px-3 py-2 text-sm font-semibold active:scale-[0.98]"
        >
          Menu
        </button>
        <div className="text-sm font-semibold text-gray-800">
          {isAdmin ? "Admin" : "Doctor"}
        </div>
      </div>

      {/* Desktop sidebar (fixed width, always visible on sm+) */}
      <aside className="hidden sm:flex sm:flex-col sm:w-64 sm:min-h-screen bg-gray-100 border-r">
        <div className="px-4 py-4 border-b">
          <p className="text-sm font-semibold text-gray-800">
            {isAdmin ? "Admin Portal" : "Doctor Portal"}
          </p>
        </div>

        <nav className="p-3">
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.to}>
                <SidebarLink to={it.to} icon={it.icon} label={it.label} />
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile drawer (overlay + slide-in) */}
      {open && (
        <div className="sm:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-[78vw] max-w-[320px] bg-gray-100 shadow-2xl border-r">
            <div className="px-4 py-4 border-b flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">
                {isAdmin ? "Admin Portal" : "Doctor Portal"}
              </p>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold bg-white text-gray-800 border active:scale-[0.98]"
              >
                Close
              </button>
            </div>

            <nav className="p-3">
              <ul className="space-y-2">
                {items.map((it) => (
                  <li key={it.to} onClick={() => setOpen(false)}>
                    <SidebarLink to={it.to} icon={it.icon} label={it.label} />
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;