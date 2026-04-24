import { useState, useContext, useRef } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";
import socket from "../socket";

const Login = () => {
  const [state, setState] = useState("Admin"); // Admin or Doctor
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);
  const registeredRef = useRef(false);

  const onsubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Admin") {
        // Admin login
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
          email,
          password,
        });
        console.log("admin login response:", data);
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          console.log(data.token)
          toast.success("Admin logged in successfully!");
        } else {
          toast.error(data.message);
        }
      } else {
        // Doctor login
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          toast.success("Doctor logged in successfully!");
              const dToken = localStorage.getItem("dToken");
              const token = dToken ;
              if (!token) return;
              socket.auth = { token, dToken };
              if (!socket.connected) socket.connect();
              let id = null;
                const payload = JSON.parse(atob(token.split(".")[1]));
                id = payload.id;
              if (!registeredRef.current) {
                registeredRef.current = true;
                socket.emit("registerDoctor", id);
              }
          
             
          
              
            
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <form
      className="min-h-[80vh] flex items-center"
      onSubmit={onsubmitHandler}
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state} </span> Login
        </p>

        {/* Email */}
        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
          />
        </div>

        {/* Password */}
        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base"
        >
          Login
        </button>

        {/* Toggle Login Type */}
        {state === "Admin" ? (
          <button
            type="button"
            className="text-sm mt-2"
            onClick={() => setState("Doctor")}
          >
            Doctor Login?{" "}
            <span className="text-primary underline cursor-pointer">
              Click Here
            </span>
          </button>
        ) : (
          <button
            type="button"
            className="text-sm mt-2"
            onClick={() => setState("Admin")}
          >
            Admin Login?{" "}
            <span className="text-primary underline cursor-pointer">
              Click Here
            </span>
          </button>
        )}
      </div>
    </form>
  );
};

export default Login;