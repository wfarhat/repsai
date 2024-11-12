import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  exerciseTarget: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  exercises: [
    {
      name: { type: String, required: true },
      sets: { type: Number, required: true },
      reps: { type: Number, required: true },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  });

const Workout = mongoose.models.Workout || mongoose.model("Workout", workoutSchema);

export default Workout;
