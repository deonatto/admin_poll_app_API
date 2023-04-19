import mongoose from "mongoose";

const PollOptionSchema = new mongoose.Schema(
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
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Poll', // Specify the referenced model (Poll)
    },
  },
  { timestamps: true }
);

const PollOption = mongoose.model("PollOption", PollOptionSchema);
export default PollOption;
