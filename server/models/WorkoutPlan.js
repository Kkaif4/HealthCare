import mongoose from "mongoose";

const workoutPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  preferencesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HealthPreferences",
  },
  content: {
    type: String,
    required: true,
  },
  durationWeeks: {
    type: Number,
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
export default WorkoutPlan;
