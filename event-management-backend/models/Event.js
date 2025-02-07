import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  category: { type: String, enum: ["tech", "music", "workshop"] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] 
});

export default mongoose.model("Event", EventSchema);
