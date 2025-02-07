import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";
import AuthContext from "../context/AuthContext";

const categories = ["All", "Tech", "Music", "Workshop"];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/events`);
      setEvents(res.data);
      setFilteredEvents(res.data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  useEffect(() => {
    let filtered = [...events];

    if (activeCategory !== "All") {
      filtered = filtered.filter(event => event.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (selectedDate) {
      filtered = filtered.filter(event => 
        new Date(event.date).toISOString().split("T")[0] === selectedDate
      );
    }

    setFilteredEvents(filtered);
  }, [activeCategory, selectedDate, events]);

  const handleBookNow = async (eventId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to book an event.");
        return;
      }

      const res = await axios.post(`${API_BASE_URL}/events/${eventId}/register`, {}, {
        headers: { "x-auth-token": token },
      });

      setFilteredEvents(filteredEvents.map(event => 
        event._id === eventId ? { ...event, attendees: [...event.attendees, user] } : event
      ));
    } catch (error) {
      console.error("Error booking event", error);
      alert("Failed to book event. Please try again.");
    }
  };

  return (
    <div className="pt-24 px-4 sm:px-6 min-h-screen bg-gray-100">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8">
        🎟️ Explore Events
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 sm:px-6 py-2 text-sm sm:text-lg font-semibold rounded-full transition ${
              activeCategory === category
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-100"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-4 mb-6 sm:mb-8">
        <input
          type="date"
          className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-auto"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <button
          className="mt-2 sm:mt-0 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          onClick={() => {
            setActiveCategory("All");
            setSelectedDate("");
          }}
        >
          Reset Filters
        </button>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event._id} className="bg-white shadow-lg hover:shadow-xl transition-all rounded-xl overflow-hidden border border-gray-300">
              <div className="p-6 sm:p-7">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">{event.name}</h3>
                <p className="text-gray-600 text-sm sm:text-lg mt-1">{event.description}</p>
                <div className="flex justify-between items-center mt-3 sm:mt-4 text-gray-500 text-xs sm:text-base">
                  <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                  <span>👥 {event.attendees.length} Attendees</span>
                </div>
                <Link
                  to={`/event/${event._id}`}
                  onClick={() => handleBookNow(event._id)}
                  className="block mt-3 sm:mt-4 text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm sm:text-lg col-span-3">
            No events found. Try changing filters!
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
