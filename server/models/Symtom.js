import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  symptoms: {
    type: [String],
    required: true,
  },
  durationDays: {
    type: Number,
    required: true,
  },
  aiAnalysis: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  reportedAt: {
    type: Date,
    default: Date.now,
  },
});

const symptom = new mongoose.model("Symptom", symptomSchema);
export default symptom;
