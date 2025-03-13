import initializeModel from "../config/gemini.js";
import User from "../models/User.js";
import Preferences from "../models/WorkoutPreferences.js";

// Save user workout preferences
export const saveWorkoutPreferences = async (req, res, next) => {
  try {
    const {
      workoutGoal,
      workoutPreferences,
      availableTimePerDay,
      equipment,
      medicalConstraints,
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
      availableTimePerDay,
      equipment,
      medicalConstraints,
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

    const response = await initializeModel(prompt);

    // Send the formatted response
    res.status(200).json({
      success: true,
      workoutPlan: response,
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
    const { userId } = req.params;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Here you would typically fetch the latest workout plan from your database
    // This is a placeholder assuming you store workout plans in the user object
    // Modify according to your actual data model
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

/**
 * Save a generated workout plan for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const saveWorkoutPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    const { workoutPlan } = req.body;

    if (!workoutPlan) {
      return res
        .status(400)
        .json({ success: false, message: "Workout plan is required" });
    }

    // Find and update user with the new workout plan
    // This is a placeholder - modify according to your actual data model
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { workoutPlan: workoutPlan },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Workout plan saved successfully",
      workoutPlan: updatedUser.workoutPlan,
    });
  } catch (error) {
    console.error("Error saving workout plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save workout plan",
      error: error.message,
    });
  }
};

/**
 * Construct a prompt for the Gemini API to generate a workout plan
 * @param {Object} user - User object
 * @param {Object} workoutPreferences - Workout preferences object
 * @returns {string} - The constructed prompt
 */
