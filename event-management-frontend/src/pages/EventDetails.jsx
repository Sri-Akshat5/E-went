import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import AuthContext from "../context/AuthContext"; // ✅ Ensure the user is logged in

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext); // ✅ Get logged-in user info
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedEvent, setUpdatedEvent] = useState({ name: "", description: "", date: "" });

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/events/${id}`); // ✅ Fixed API URL
      setEvent(res.data);
      setUpdatedEvent({ name: res.data.name, description: res.data.description, date: res.data.date });
    } catch (error) {
      console.error("Error fetching event", error);
      setError("Event not found or an error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Input Change for Editing
  const handleChange = (e) => {
    setUpdatedEvent({ ...updatedEvent, [e.target.name]: e.target.value });
  };

  // ✅ Update Event
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/api/events/${id}`, updatedEvent, {
        headers: { "x-auth-token": token },
      });
      alert("Event updated successfully!");
      setIsEditing(false);
      fetchEvent();
    } catch (error) {
      console.error("Error updating event", error);
      alert("Failed to update event.");
    }
  };

  // ✅ Delete Event
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/events/${id}`, {
        headers: { "x-auth-token": token },
      });
      alert("Event deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error deleting event", error);
      alert("Failed to delete event.");
    }
  };

  if (loading) return <p className="text-center mt-6 text-gray-600">Loading event details...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

  return (
    <div className="pt-24 p-6 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center">
      <div className="bg-white shadow-xl p-8 rounded-xl w-full max-w-2xl">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-4">{event.name}</h2>
        <p className="text-gray-600 text-lg text-center">{event.description}</p>
        <div className="mt-6 flex justify-between text-gray-500 text-lg">
          <span>📅 Date: {new Date(event.date).toLocaleDateString()}</span>
          <span>👥 Attendees: {event.attendees.length}</span>
        </div>

        {/* Show Update & Delete Buttons if User is the Event Creator */}
        {user?.id === event.createdBy && (
          <div className="mt-6 flex justify-between">
            <button onClick={() => setIsEditing(!isEditing)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              {isEditing ? "Cancel" : "Edit Event"}
            </button>
            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
              Delete Event
            </button>
          </div>
        )}

        {/* ✅ Editing Form */}
        {isEditing && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Edit Event</h3>
            <input
              type="text"
              name="name"
              value={updatedEvent.name}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
              placeholder="Event Name"
            />
            <textarea
              name="description"
              value={updatedEvent.description}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
              rows="3"
              placeholder="Event Description"
            />
            <input
              type="date"
              name="date"
              value={updatedEvent.date.split("T")[0]}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />
            <button onClick={handleUpdate} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
