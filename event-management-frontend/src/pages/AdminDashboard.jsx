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

  // ✅ Fetch User's Events
  const fetchUserEvents = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No auth token found.");
        return;
      }

      const res = await axios.get(`${API_BASE_URL}/events/admin`, {
        headers: { "x-auth-token": token },
      });

      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching user events", error);
    }
  };

  // ✅ Handle Edit Click
  const handleEditClick = (event) => {
    setEditingEvent(event._id);
    setFormData({
      name: event.name,
      description: event.description,
      date: new Date(event.date).toISOString().split("T")[0], // Format date for input
    });
  };

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Update Submit
  const handleUpdate = async (eventId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No auth token found.");
        return;
      }

      const res = await axios.put(
        `${API_BASE_URL}/events/${eventId}`,
        formData,
        { headers: { "x-auth-token": token } }
      );

      // ✅ Update event in state
      setEvents(events.map(event => (event._id === eventId ? res.data : event)));
      setEditingEvent(null);
    } catch (error) {
      console.error("Error updating event", error);
    }
  };

  // ✅ Handle Delete Event
  const handleDelete = async (eventId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No auth token found.");
        return;
      }

      await axios.delete(`${API_BASE_URL}/events/${eventId}`, {
        headers: { "x-auth-token": token },
      });

      // ✅ Remove event from UI
      setEvents(events.filter(event => event._id !== eventId));
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-gray-100">
      <h2 className="text-5xl font-extrabold text-center text-gray-800 mb-8">
        📋 Your Created Events
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="bg-white shadow-lg hover:shadow-xl transition-all rounded-xl overflow-hidden border border-gray-300">
              <div className="p-7">
                {editingEvent === event._id ? (
                  // ✅ Edit Mode
                  <>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border p-2 rounded mb-2"
                    />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full border p-2 rounded mb-2"
                    />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full border p-2 rounded mb-2"
                    />
                    <button
                      onClick={() => handleUpdate(event._id)}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg mr-2"
                    >
                      ✅ Save
                    </button>
                    <button
                      onClick={() => setEditingEvent(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      ❌ Cancel
                    </button>
                  </>
                ) : (
                  // ✅ Normal View
                  <>
                    <h3 className="text-2xl font-semibold text-gray-900">{event.name}</h3>
                    <p className="text-gray-600 text-lg mt-1">{event.description}</p>
                    <div className="flex justify-between items-center mt-4 text-gray-500">
                      <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                      <span>👥 {event.attendees.length} Attendees</span>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleEditClick(event)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
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
