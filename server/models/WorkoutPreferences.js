import mongoose from "mongoose";

const workoutPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  //workout
  workoutGoal: {
    type: String,
    enum: ["weight-loss", "weight-gain", "muscle-gain", "maintenance"],
    required: true,
  },
  workoutPreferences: {
    type: String,
    enum: ["home", "gym", "outdoor", "yoga"],
    required: true,
  },
  targetWeight: { type: Number, required: true },
  timePeriod: { type: String, required: true }, // e.g., "3 months"
  availableTimePerDay: { type: String, required: true }, // e.g., "1 hour"
  equipment: { type: [String], default: [] },
  medicalConstraints: { type: [String], default: [] },
  activityLevel: {
    type: String,
    enum: ["sedentary", "light", "moderate", "active"],
    required: true,
  },
  workoutDaysPerWeek: {
    type: Number,
    min: 1,
    max: 7,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const WorkoutPreferences =
  mongoose.models.WorkoutPreferences ||
  mongoose.model("WorkoutPreferences", workoutPreferenceSchema);
export default WorkoutPreferences;
