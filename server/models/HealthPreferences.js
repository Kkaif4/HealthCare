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

  //diet
  dietType: {
    type: String,
    enum: [
      "vegetarian",
      "non-vegetarian",
      "eggetarian",
      "vegan",
      "pescatarian",
    ],
    required: true,
  },
  foodAllergies: { type: [String], default: [] },
  religiousRestrictions: { type: String, default: "None" },
  favoriteFoods: { type: [String], default: [] },
  dislikedFoods: { type: [String], default: [] },
  budget: { type: String, enum: ["low", "medium", "high"], required: true },
  targetWeight: { type: Number, required: true },
  timePeriod: { type: String, required: true }, // e.g., "3 months"

  // New fields for workout
  workoutPreferences: {
    type: String,
    enum: ["home", "gym", "outdoor", "yoga"],
    required: true,
  },
  availableTimePerDay: { type: String, required: true }, // e.g., "1 hour"
  equipment: { type: [String], default: [] },
  medicalConstraints: { type: [String], default: [] },

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
