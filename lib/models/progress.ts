import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  days: { type: [Number], default: [] },
}, {
  timestamps: true,
});

const Progress = mongoose.models.Progress || mongoose.model("Progress", progressSchema);

export default Progress;
