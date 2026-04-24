/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const RelatedDoctors = ({ speciality, docId }) => {
  const [relDoc, setRelDocs] = useState([]);
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(backendUrl + "/api/doctor/list");
        const data = await res.json();

        if (data.success) {
          const doctorsData = (data.doctors || []).filter(
            (doc) => doc && doc.speciality === speciality && doc._id !== docId
          );
          setRelDocs(doctorsData);
        } else {
          console.error("Failed to fetch doctors:", data.message);
          setRelDocs([]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setRelDocs([]);
      }
    };
    
    if (!speciality) {
      setRelDocs([]);
      return;
    }

    fetchDoctors();
  }, [speciality, docId, backendUrl]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2 text-center">
        Top Related Doctors
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Simply browse through our extensive list of trusted doctors.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {relDoc.slice(0, 5).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            key={index}
            className="bg-white p-4 shadow-md rounded-lg cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-60 bg-blue-200 object-cover rounded-md"
            />
            <div className="mt-4">
              <div className="mt-2">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-gray-500">{item.speciality}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="btn btn-primary px-10 py-3 rounded-full font-bold">
          More
        </button>
      </div>
    </div>
  );
};

export default RelatedDoctors;
