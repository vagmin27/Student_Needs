import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
{
userId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},

tutorId: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
},


tutorName: {
  type: String,
  required: true,
},

subject: {
  type: String,
  required: true,
},

date: {
  type: String,
  required: true,
},

time: {
  type: String,
  required: true,
},

status: {
  type: String,
  enum: ["pending", "accepted", "upcoming", "in_progress", "completed", "declined", "Booked", "Completed", "Cancelled"],
  default: "pending",
},
meetingLink: {
  type: String,
  default: "",
},

},
{ timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);