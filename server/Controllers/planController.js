import HealthPreference from "../models/HealthPreferences.js";
import DietPlan from "../models/DietPlan.js";
import WorkoutPlan from "../models/WorkoutPlan.js";
import {
  generateDietPrompt,
  generateWorkoutPrompt,
} from "../utils/promptGenerator.js";
import initializeModel from "../config/gemini.js";
import { formatPlanResponse } from "../utils/responseFormatter.js";

const geminiModel = initializeModel();

// Save user preferences
export const savePreferences = async (req, res, next) => {
  try {
    const {
      goal,
      dietaryRestrictions,
      activityLevel,
      workoutDaysPerWeek,
      dietType,
      foodAllergies,
      religiousRestrictions,
      favoriteFoods,
      dislikedFoods,
      budget,
      targetWeight,
      timePeriod,
      workoutPreferences,
      availableTimePerDay,
      equipment,
      medicalConstraints,
    } = req.body;

    const userId = req.user.id;

    // Validate required fields
    if (!goal || !activityLevel || !workoutDaysPerWeek || !dietType) {
      console.error("Missing required preference fields");
      return res.status(400).json({
        success: false,
        error: "Missing required preference fields",
      });
    }

    // Delete previous preferences
    await HealthPreference.deleteMany({ userId });

    // Create new preferences
    const preferences = await HealthPreference.create({
      userId,
      goal,
      dietaryRestrictions,
      activityLevel,
      workoutDaysPerWeek,
      dietType,
      foodAllergies,
      religiousRestrictions,
      favoriteFoods,
      dislikedFoods,
      budget,
      targetWeight,
      timePeriod,
      workoutPreferences,
      availableTimePerDay,
      equipment,
      medicalConstraints,
    });

    res.status(201).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    console.error("Error saving preferences:", error.message);
    next(error);
  }
};

// Generate diet plan
export const generateDietPlan = async (req, res, next) => {
  try {
    const user = req.user;
    const preferences = await HealthPreference.findOne({ userId: user.id });

    if (!preferences) {
      console.error("Complete preferences questionnaire first");
      return res.status(400).json({
        success: false,
        error: "Complete preferences questionnaire first",
      });
    }

    const prompt = generateDietPrompt(user, preferences);
    console.log("Prompt:", prompt);
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();
    const formattedContent = formatPlanResponse(generatedText);

    const dietPlan = await DietPlan.create({
      userId: user.id,
      preferencesId: preferences._id,
      content: formattedContent,
    });

    res.status(201).json({
      success: true,
      data: dietPlan,
    });
  } catch (error) {
    console.error("Diet plan generation error:", error.message);
    next(error);
  }
};

// Generate workout plan
export const generateWorkoutPlan = async (req, res, next) => {
  try {
    const user = req.user;
    const preferences = await HealthPreference.findOne({ userId: user.id });

    if (!preferences) {
      return res.status(400).json({
        success: false,
        error: "Complete preferences questionnaire first",
      });
    }

    const prompt = generateWorkoutPrompt(user, preferences);
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();
    const formattedContent = formatPlanResponse(generatedText);

    const workoutPlan = await WorkoutPlan.create({
      userId: user.id,
      preferencesId: preferences._id,
      content: formattedContent,
    });

    res.status(201).json({
      success: true,
      data: workoutPlan,
    });
  } catch (error) {
    console.error("Workout plan generation error:", error.message);
    next(error);
  }
};

