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
  enum: ["Booked", "Completed", "Cancelled"],
  default: "Booked",
},

},
{ timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);