import User from '../models/User.js';
import Preferences from '../models/DietPreferences.js';
import initializeModel from '../config/gemini.js';
import { constructDietPlanPrompt } from '../utils/promptGenerator.js';
import { cleanGeminiResponse } from '../utils/responseFormatter.js';
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

    await Preferences.deleteMany({ userId });

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
    res.status(201).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    next(error).message;
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
        .json({ success: false, message: 'Invalid user request' });
    }
    const user = await User.findById(req.user.id);
    const userId = user.id;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const preferences = await Preferences.findOne({ userId });
    if (!preferences) {
      return res
        .status(404)
        .json({ success: false, message: 'Diet Preferences not found' });
    }

    const prompt = constructDietPlanPrompt(user, preferences);
    const response = await geminiModel.generateContent(prompt);
    if (
      !response ||
      !response.response.candidates ||
      response.response.candidates.length === 0 ||
      !response.response.candidates[0].content.parts ||
      response.response.candidates[0].content.parts.length === 0
    ) {
      console.error('Gemini API returned an invalid response:', response);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate diet plan due to invalid API response',
      });
    }
    const plan = response.response.candidates[0].content.parts[0].text;
    const formattedPlan = cleanGeminiResponse(plan);
    user.dietPlan.text = null;
    user.dietPlan.text = formattedPlan;
    user.dietPlan.createdAt = Date.now();
    await user.save();
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error generating diet plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate diet plan',
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
    const userId = req.user.id;
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    if (!user.dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'No diet plan found for this user try generating diet plan',
      });
    }
    res.status(200).json({
      success: true,
      dietPlan: user.dietPlan.text,
      dietPlanCreated: user.dietPlan.createdAt,
    });
  } catch (error) {
    console.error('Error getting diet plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve diet plan',
      error: error.message,
    });
  }
};

export const getDietPreferences = async (req, res) => {
  try {
    const userId = req.params.userId;
    const dietPreferences = await Preferences.findOne({ userId });
    if (!dietPreferences) {
      return res.status(404).json({
        success: false,
        message: 'Diet Preferences not found for this user',
      });
    }
    res.json({
      success: true,
      data: dietPreferences,
      message: 'Diet Preferences',
    });
  } catch (error) {
    console.error('Error getting diet preferences:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve diet preferences',
      error: error.message,
    });
  }
};
