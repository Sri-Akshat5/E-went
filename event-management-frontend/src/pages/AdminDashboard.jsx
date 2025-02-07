import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";
import AuthContext from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", date: "" });

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No auth token found.");

      const res = await axios.get(`${API_BASE_URL}/events/admin`, {
        headers: { "x-auth-token": token },
      });

      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching user events", error);
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event._id);
    setFormData({
      name: event.name,
      description: event.description,
      date: new Date(event.date).toISOString().split("T")[0],
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No auth token found.");

      const res = await axios.put(
        `${API_BASE_URL}/events/${eventId}`,
        formData,
        { headers: { "x-auth-token": token } }
      );

      setEvents(events.map(event => (event._id === eventId ? res.data : event)));
      setEditingEvent(null);
    } catch (error) {
      console.error("Error updating event", error);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No auth token found.");

      await axios.delete(`${API_BASE_URL}/events/${eventId}`, {
        headers: { "x-auth-token": token },
      });

      setEvents(events.filter(event => event._id !== eventId));
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  return (
    <div className="pt-24 px-4 sm:px-6 min-h-screen bg-gray-100">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-800 mb-8">
        📋 Your Created Events
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="bg-white shadow-lg hover:shadow-xl transition-all rounded-xl overflow-hidden border border-gray-300 p-6 sm:p-7">
              {editingEvent === event._id ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mb-2 text-sm sm:text-base"
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mb-2 text-sm sm:text-base"
                  />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mb-2 text-sm sm:text-base"
                  />
                  <div className="flex flex-col sm:flex-row sm:space-x-2">
                    <button
                      onClick={() => handleUpdate(event._id)}
                      className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg mb-2 sm:mb-0"
                    >
                      ✅ Save
                    </button>
                    <button
                      onClick={() => setEditingEvent(null)}
                      className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">{event.name}</h3>
                  <p className="text-gray-600 text-sm sm:text-lg mt-1">{event.description}</p>
                  <div className="flex justify-between items-center mt-4 text-gray-500 text-sm sm:text-base">
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                    <span>👥 {event.attendees.length} Attendees</span>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row sm:space-x-2">
                    <button
                      onClick={() => handleEditClick(event)}
                      className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg mb-2 sm:mb-0"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  <Link to={`/event/${event._id}`} className="block mt-4 text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                    View Details
                  </Link>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg col-span-3">
            You haven't created any events.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
