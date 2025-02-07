import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const Register = () => {
  const [userData, setUserData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, userData);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert("Error registering. Please try again.");
    }
  };

  return (
    <div className="pt-24 p-4 sm:p-6 min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white/80 backdrop-blur-lg shadow-xl p-6 sm:p-8 rounded-xl w-full max-w-sm sm:max-w-md">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6">📝 Register</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            onChange={handleChange}
            required
          />
          
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 px-6 rounded-lg transition transform hover:scale-105 text-sm sm:text-base">
            🚀 Register
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600 text-sm sm:text-base">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
