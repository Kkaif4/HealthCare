import mongoose from "mongoose";

const dietPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dietGoal: {
    type: String,
    enum: ["weight-loss","weight-gain", "muscle-gain", "maintenance"],
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
  favoriteFoods: { type: [String], default: [] },
  dislikedFoods: { type: [String], default: [] },
  budget: { type: String, enum: ["low", "medium", "high"], required: true },
  targetWeight: { type: Number, required: true },
  timePeriod: { type: String, required: true }, // e.g., "3 months"
  dietaryRestrictions: {
    type: [String], // e.g., ['gluten-free']
    default: ["null"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DietPreferences = mongoose.model("DietPreferences", dietPreferenceSchema);
export default DietPreferences;
