import express from "express";
import mongoose from "mongoose";  
import Event from "../models/Event.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Middleware to Verify User Token
const verifyToken = (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if (!token) return res.status(403).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // ✅ Fix: Attach decoded user data
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

// ✅ Middleware to Prevent Guests from Creating/Modifying Events
const restrictGuest = (req, res, next) => {
  if (req.user?.role === "guest") {
    return res.status(403).json({ message: "Guests cannot perform this action." });
  }
  next();
};

// ✅ Create Event (Guests cannot create events)
router.post("/", verifyToken, restrictGuest, async (req, res) => {
  try {
    const newEvent = new Event({ ...req.body, createdBy: req.user.id });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get All Events (Guests can access)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate("attendees", "name email");
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Events Created by Logged-in User (ADMIN DASHBOARD)
router.get("/admin", verifyToken, async (req, res) => {
  try {
    console.log("Fetching events for user ID:", req.user.id);

    if (!req.user || !req.user.id) {
      console.log("❌ Unauthorized request: No user ID");
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // ✅ Fetch only events created by this user
    const events = await Event.find({ createdBy: req.user.id }).populate("attendees", "name email");

    console.log("✅ Events fetched:", events.length);
    res.json(events);
  } catch (err) {
    console.error("❌ Error fetching user events:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get Event by ID
router.get("/:id", async (req, res) => {
  try {
    console.log("Fetching event with ID:", req.params.id);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" }); // ✅ Prevents MongoDB CastError
    }

    const event = await Event.findById(req.params.id).populate("attendees", "name email");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Register for Event (Guests cannot register)
router.post("/:id/register", verifyToken, restrictGuest, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.attendees.includes(req.user.id)) {
      event.attendees.push(req.user.id);
      await event.save();
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Event
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.createdBy.equals(req.user.id)) {
      return res.status(403).json({ message: "Not authorized to edit this event" });
    }

    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Error updating event" });
  }
});

// ✅ Delete Event
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.createdBy.equals(req.user.id)) {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting event" });
  }
});

router.post("/:id/register", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.attendees.includes(req.user.id)) {
      event.attendees.push(req.user.id);
      await event.save();
    } else {
      return res.status(400).json({ message: "You are already registered for this event." });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
