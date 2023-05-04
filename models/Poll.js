import mongoose from "mongoose";

// Define the Poll schema
const PollSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 2,
      max: 50,
      unique: true,
    },
    description: {
      type: String,
      min: 5,
      max: 50,
    },
    active: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Poll = mongoose.model("Poll", PollSchema);
export default Poll;
