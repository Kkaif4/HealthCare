import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  goal: {
    type: String,
    enum: ["weight-loss", "muscle-gain", "maintenance"],
    required: true,
  },
  dietaryRestrictions: {
    type: [String], // e.g., ['vegetarian', 'gluten-free']
    default: [],
  },
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

const HealthPreference = mongoose.model("HealthPreference", preferenceSchema);
export default HealthPreference;
