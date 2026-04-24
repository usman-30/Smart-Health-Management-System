/* eslint-disable no-unused-vars */
import React from "react";
import { doctors } from "../assets/assets";
import { useNavigate } from "react-router-dom";

function TopDoctors() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2 text-center">
        Top Doctors to Book
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Simply browse through our extensive list of trusted doctors.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {doctors.slice(0, 10).map((item, index) => (
          <div onClick={() => {navigate(`/appointment/${item._id}`);scrollTo(0,0)}}
            key={index} 
            className="bg-white p-4 shadow-md rounded-lg cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-60 bg-blue-200 object-cover rounded-md"
            />
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                {/* <p className="w-3 h-3 bg-green-500 rounded-full"></p> */}
                {/* <p className="text-green-600 font-medium">Available</p> */}
              </div>
              <div className="mt-2">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-gray-500">{item.speciality}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="btn btn-primary px-10 py-3  rounded-full font-bold">More</button>
      </div>
    </div>
  );
}

export default TopDoctors;
