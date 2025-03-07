import mongoose from "mongoose";

const dietPlanSchema = new mongoose.Schema({
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
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "completed", "archived"],
    default: "active",
  },
});

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);
export default DietPlan;
