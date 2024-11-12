import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true }, 
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String },
    bio: { type: String },
    workouts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout",
      },
    ],
    onboarded: { type: Boolean, default: false },
    workoutDays: {
      type: [Date], 
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
