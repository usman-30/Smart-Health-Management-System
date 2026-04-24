/* eslint-disable no-unused-vars */
import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

function Banner() {
  const navigate = useNavigate();
  return (
    <>
      <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 flex flex-col md:flex-row my-10">
        <div className=" w-full md:w-1/2">
          <div className=" space-y-12 mt-12 md:mt-32">
            <h1 className="text-4xl font-bold">
              Welcome!
              <span className="text-blue-800">
                Elevating your Healthcare Experience
              </span>
            </h1>
            <p className="text-xl">
              We provide effortless access to personalized healthcare by
              seamlessly connectings doctor and patients through a unified
              platform
            </p>
            <button
              onClick={() => navigate("/doctors")}
              className="  rounded-full bg-blue-800 py-3 px-4 text-white font-semibold"
            >
              Book an Appointment
            </button>
            {/* <div className="flex justify-center space-x-6 mt-6">
              <button className="btn bg-blue-900 text-white hover:bg-blue-400 rounded-full px-10 py-2">
                I`m Patient
              </button>
              <button className="btn  bg-blue-900 text-white hover:bg-blue-400  rounded-full px-10 py-2">
                I`m Doctor
              </button>
            </div> */}
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <img src={assets.header_img} />
        </div>
      </div>
    </>
  );
}

export default Banner;
