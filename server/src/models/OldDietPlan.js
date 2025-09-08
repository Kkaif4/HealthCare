import mongoose from "mongoose";

const dietPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  preferencesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DietPreferences",
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "completed", "archived"],
    default: "active",
  },
  schedule: [
    {
      time: String,
      mealType: String,
      dishName: String,
      ingredients: [String],
      quantity: String,
      calories: Number,
      protein: Number,
    },
  ],
  totals: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
  },
  metadata: {
    targetWeight: Number,
    timePeriod: String,
    dietType: String,
  },
  isUnstructured: { type: Boolean, default: false },
  rawContent: String,
});

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);
export default DietPlan;
