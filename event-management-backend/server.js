import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import Event from "./models/Event.js";
import authRoutes from "./routes/auth.js"; 
import eventRoutes from "./routes/events.js"; 

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// WebSocket for real-time event updates
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinEvent", async (eventId) => {
    try {
      const event = await Event.findById(eventId);
      if (event) {
        socket.join(eventId);
        io.to(eventId).emit("attendeeUpdate", event);
      }
    } catch (error) {
      console.error("Error joining event:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
