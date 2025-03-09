import mongoose from "mongoose";

const workoutPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  preferencesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkoutPreferences",
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
  schedule: [
    {
      day: String,
      focus: String,
      exercises: [String],
      setsReps: String,
      duration: String,
      intensity: String,
    },
  ],
  totals: {
    weeklySessions: Number,
    totalHours: Number,
    avgCalories: Number,
  },
  metadata: {
    equipment: [String],
    availableTime: String,
  },
  durationWeeks: Number,
  isUnstructured: { type: Boolean, default: false },
  rawContent: String,
});

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
export default WorkoutPlan;
