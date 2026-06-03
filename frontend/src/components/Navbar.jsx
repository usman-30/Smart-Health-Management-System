
import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext"; // Ensure you import AppContext
import { assets } from "../assets/assets";

function Navbar() {
  const { token, setToken } = useContext(AppContext); // Access token from context
  const [isSticky, setIsSticky] = useState(false);
  const [profilePic, setProfilePic] = useState(""); // State for the profile picture
  const navigate = useNavigate();
  const location = useLocation();

  // Track scroll position with useEffect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Check if user is logged in
    if (token) {
      setProfilePic(assets.profile_pic); // Set the profile picture if logged in
    }

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [token]); // Only rerun when token changes

  // Handle logout
  const handleLogout = () => {
    setToken(null); // Clear token from context
    localStorage.removeItem("token"); // Remove the token from localStorage
    navigate("/"); // Redirect to the home page
  };

  // Don't render navbar on login or logout page
  if (location.pathname === "/login" || location.pathname === "/logout") {
    return null;
  }

  return (
    <div className="relative">
      <div
        className={`navbar bg-blue-900 text-white ${isSticky ? "fixed top-0 left-0 right-0 z-50 shadow-md" : ""}`}
      >
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-blue-800 rounded-box z-[1] mt-3 w-52 p-2 shadow text-white"
            >
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>All Doctors</a>
              </li>
              <li>
                <a>About</a>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">Doctor & Patient</a>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <NavLink to="/" className="hover:bg-gray-400">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="doctors" className="hover:bg-gray-400">
                All Doctors
              </NavLink>
            </li>
            <li>
              <NavLink to="about" className="hover:bg-gray-400">
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="contact" className="hover:bg-gray-400">
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="navbar-end">
          {!token ? (
            <NavLink
              to="/login"
              className="btn bg-white text-blue-900 hover:bg-gray-200"
            >
              Login
            </NavLink>
          ) : (
            <div className="flex items-center space-x-2 cursor-pointer group relative">
              <img
                src={profilePic}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <img src={assets.dropdown_icon} alt="Dropdown Icon" />
              <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block ">
                <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                  <NavLink
                    to="/my-profile"
                    className="hover:text-black cursor-pointer"
                  >
                    My profile
                  </NavLink>
                  <NavLink
                    to="/my-appointments"
                    className="hover:text-black cursor-pointer"
                  >
                    My appointments
                  </NavLink>
                  <button
                    className="hover:text-black cursor-pointer "
                    onClick={handleLogout} // Handle logout
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;