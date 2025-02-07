import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const CreateEvent = () => {
  const { isGuest } = useContext(AuthContext);
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date: "",
    category: "tech",
  });

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  //  Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("token"); // Get user token
      if (!token) {
        alert("Please log in to create an event.");
        navigate("/login");
        return;
      }
  
      await axios.post(`${API_BASE_URL}/events`, eventData, {  
        headers: { "x-auth-token": token },
      });
  
      alert("Event created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating event", error);
      alert("Failed to create event.");
    }
  };
  

  // Restrict Guests from Creating Events
  if (isGuest) {
    return (
      <div className="pt-24 text-center text-red-500 text-2xl font-bold">
        🚫 Guest users cannot create events. Please{" "}
        <a href="/register" className="text-blue-500 underline">
          register
        </a>
        .
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white/80 backdrop-blur-lg shadow-xl p-8 rounded-xl w-full max-w-2xl">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">🎉 Create Event</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Event Name"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={eventData.name}
            required
          />
          <textarea
            name="description"
            placeholder="Event Description"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={eventData.description}
            rows="3"
            required
          ></textarea>
          <input
            type="date"
            name="date"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={eventData.date}
            required
          />
          <select
            name="category"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={eventData.category}
          >
            <option value="tech">Tech</option>
            <option value="music">Music</option>
            <option value="workshop">Workshop</option>
          </select>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105">
            🚀 Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
