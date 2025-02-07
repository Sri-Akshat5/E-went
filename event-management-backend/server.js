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
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Before Starting the Server
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Wait 5 seconds before failing
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};
connectDB();

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// ✅ WebSocket for Real-Time Event Updates
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

// ✅ Start Server After Database Connection
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
