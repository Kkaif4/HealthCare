import User from "../models/User.js";
import Preferences from "../models/DietPreferences.js";
import initializeModel from "../config/gemini.js";
import { constructDietPlanPrompt } from "../utils/promptGenerator.js";
const geminiModel = initializeModel();
// Save user diet Preferences
export const saveDietPreferences = async (req, res, next) => {
  try {
    const {
      dietGoal,
      dietType,
      foodAllergies,
      favoriteFoods,
      dislikedFoods,
      dietaryRestrictions,
      budget,
      targetWeight,
      timePeriod,
    } = req.body;

    const userId = req.user.id;

    // Delete previous Preferences
    await Preferences.deleteMany({ userId });

    // Create new Preferences
    const preferences = await Preferences.create({
      userId,
      dietGoal,
      dietType,
      foodAllergies,
      favoriteFoods,
      dislikedFoods,
      dietaryRestrictions,
      budget,
      targetWeight,
      timePeriod,
    });
    console.log("new Preferences created");
    res.status(201).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    console.error("Error saving Preferences:", error.message);
    next(error);
  }
};

/**
 * Generate a diet plan based on user information and Preferences
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const generateDietPlan = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user request" });
    }
    const user = await User.findById(req.user.id);
    const userId = user.id;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const preferences = await Preferences.findOne({ userId });
    if (!preferences) {
      return res
        .status(404)
        .json({ success: false, message: "Diet Preferences not found" });
    }

    // Construct prompt for Gemini API
    const prompt = constructDietPlanPrompt(user, preferences);
    console.log(prompt);
    const response = await geminiModel.generateContent(prompt);
    if (!response) {
      console.log("Couldn't generate diet plan");
      return res
        .status(500)
        .json({ success: false, message: "Failed to generate diet plan" });
    }

    console.log("diet plan generated");
    res.status(200).json({
      success: true,
      dietPlan: response,
    });
  } catch (error) {
    console.error("Error generating diet plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate diet plan",
      error: error.message,
    });
  }
};

/**
 * Get the latest diet plan for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getDietPlan = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!user.dietPlan) {
      return res.status(404).json({
        success: false,
        message: "No diet plan found for this user try generating diet plan",
      });
    }

    res.status(200).json({
      success: true,
      dietPlan: user.dietPlan,
    });
  } catch (error) {
    console.error("Error getting diet plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve diet plan",
      error: error.message,
    });
  }
};
