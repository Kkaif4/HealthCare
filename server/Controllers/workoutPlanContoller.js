import initializeModel from "../config/gemini.js";
import User from "../models/User.js";
import Preferences from "../models/WorkoutPreferences.js";
import { constructWorkoutPlanPrompt } from "../utils/promptGenerator.js";
import { cleanGeminiResponse } from "../utils/responseFormatter.js";
const geminiModel = initializeModel();
// Save user workout preferences
export const saveWorkoutPreferences = async (req, res, next) => {
  try {
    const {
      workoutGoal,
      workoutPreferences,
      workoutDuration,
      equipment,
      healthConditions,
      activityLevel,
      workoutDaysPerWeek,
      targetWeight,
      timePeriod,
    } = req.body;

    const userId = req.user.id;

    // Delete previous preferences
    await Preferences.deleteMany({ userId });

    // Create new preferences
    const preferences = await Preferences.create({
      userId,
      workoutGoal,
      workoutPreferences,
      workoutDuration,
      equipment,
      healthConditions,
      activityLevel,
      workoutDaysPerWeek,
      targetWeight,
      timePeriod,
    });
    console.log("New wokrout preferences created");
    res.status(201).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    console.error("Error saving workout preferences:", error.message);
    next(error);
  }
};

/**
 * Generate a workout plan based on user information and preferences
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const generateWorkoutPlan = async (req, res) => {
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

    const preferences = await Preferences.findOne({
      userId,
    });
    if (!preferences) {
      return res
        .status(404)
        .json({ success: false, message: "Workout preferences not found" });
    }

    // Construct prompt for Gemini API
    const prompt = constructWorkoutPlanPrompt(user, preferences);

    const response = await geminiModel.generateContent(prompt);
    if (
      !response ||
      !response.response.candidates ||
      response.response.candidates.length === 0 ||
      !response.response.candidates[0].content.parts ||
      response.response.candidates[0].content.parts.length === 0
    ) {
      console.error("Gemini API returned an invalid response:", response);
      return res.status(500).json({
        success: false,
        message: "Failed to generate diet plan due to invalid API response",
      });
    }
    const Text = response.response.candidates[0].content.parts[0].text;
    if (!Text) {
      console.log("Couldn't generate diet plan");
      return res
        .status(500)
        .json({ success: false, message: "Failed to generate diet plan" });
    }
    const WorkoutPlan = cleanGeminiResponse(Text);
    console.log("diet plan generated");
    user.workoutPlan.text = null;
    user.workoutPlan.text = WorkoutPlan;
    user.workoutPlan.createdAt = Date.now();
    await user.save();
    // Send the formatted response
    res.status(200).json({
      success: true,
      workoutPlan: user.workoutPlan.text,
      workoutPlanCreated: user.workoutPlan.createdAt,
    });
  } catch (error) {
    console.error("Error generating workout plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate workout plan",
      error: error.message,
    });
  }
};

/**
 * Get the latest workout plan for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getWorkoutPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!user.workoutPlan) {
      return res.status(404).json({
        success: false,
        message: "No workout plan found for this user",
      });
    }

    res.status(200).json({
      success: true,
      workoutPlan: user.workoutPlan,
    });
  } catch (error) {
    console.error("Error getting workout plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve workout plan",
      error: error.message,
    });
  }
};

export const getWorkoutPreferences = async (req, res) => {
  try {
    const userId = req.params.userId;
    const wokroutPreferences = await Preferences.findOne({ userId });
    if (!wokroutPreferences) {
      return res.status(404).json({
        success: false,
        message: "Diet Preferences not found for this user",
      });
    }
    res.json({
      success: true,
      data: wokroutPreferences,
      message: "Workout Preferences",
    });
  } catch (error) {
    console.error("Error getting diet preferences:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve diet preferences",
      error: error.message,
    });
  }
};
