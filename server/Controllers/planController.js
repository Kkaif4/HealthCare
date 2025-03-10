import DietPreference from "../models/DietPreferences.js";
import WorkoutPreference from "../models/workoutPreferences.js";
import WorkoutPlan from "../models/WorkoutPlan.js";
import DietPlan from "../models/DietPlan.js";
import {
  generateDietPrompt,
  generateWorkoutPrompt,
} from "../utils/promptGenerator.js";
import initializeModel from "../config/gemini.js";
import { formatPlanResponse } from "../utils/responseFormatter.js";

const geminiModel = initializeModel();

const MAX_RETRIES = 2;

// Common generator with retry logic
const generateWithRetry = async (prompt, planType) => {
  let attempts = 0;

  while (attempts <= MAX_RETRIES) {
    try {
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const formatted = formatPlanResponse(response.text());

      if (formatted.type === planType || formatted.type === "diet") {
        return formatted;
      }
      attempts++;
      console.log(`Attempt ${attempts}/${MAX_RETRIES}`);
    } catch (error) {
      console.error("Generation error:", error.message);
      attempts++;
      if (attempts > MAX_RETRIES) throw error;
    }
  }
  throw new Error(`Failed after ${MAX_RETRIES} retries`);
};

const handleFailedPlan = async (rawText, user, preferences) => {
  // 1. Try to save raw text temporarily
  const backupPlan = await DietPlan.create({
    userId: user.id,
    preferencesId: preferences._id,
    rawContent: rawText,
    isUnstructured: true,
  });

  // 2. Alert monitoring system
  console.error("Structured plan failed, raw backup saved:", backupPlan._id);

  return backupPlan;
};

// Save user diet preferences
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

    // Delete previous preferences
    await DietPreference.deleteMany({ userId });

    // Create new preferences
    const preferences = await DietPreference.create({
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
    console.error("Error saving preferences:", error.message);
    next(error);
  }
};
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
    await WorkoutPreference.deleteMany({ userId });

    // Create new preferences
    const preferences = await WorkoutPreference.create({
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
    console.log("New preferences created");
    res.status(201).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    console.error("Error saving workout preferences:", error.message);
    next(error);
  }
};

// Generate diet plan
export const generateDietPlan = async (req, res, next) => {
  try {
    const user = req.user;
    const preferences = await DietPreference.findOne({ userId: user.id });

    if (!preferences) {
      return res.status(400).json({
        success: false,
        error: "Complete preferences questionnaire first",
      });
    }

    const prompt = generateDietPrompt(user, preferences);
    const formattedContent = await generateWithRetry(prompt, "diet");

    const dietPlan = await DietPlan.create({
      userId: user.id,
      preferencesId: preferences._id,
      schedule: formattedContent.schedule,
      totals: formattedContent.totals,
      metadata: {
        targetWeight: preferences.targetWeight,
        timePeriod: preferences.timePeriod,
        dietType: preferences.dietType,
      },
    });

    res.status(201).json({
      success: true,
      data: dietPlan,
    });
  } catch (error) {
    console.error("Diet plan error:", error.message);

    // Fallback raw content save
    if (error.message.includes("Failed to generate")) {
      const rawPlan = await DietPlan.create({
        userId: req.user.id,
        rawContent: error.rawContent || "Generation failed",
        isUnstructured: true,
      });

      return res.status(206).json({
        success: true,
        data: rawPlan,
        warning: "Plan generated in basic format",
      });
    }

    next(error);
  }
};

// Generate workout plan
export const generateWorkoutPlan = async (req, res, next) => {
  try {
    const user = req.user;
    const preferences = await WorkoutPreference.findOne({ userId: user.id });

    if (!preferences?.timePeriod) {
      return res.status(400).json({
        success: false,
        error: "Complete preferences questionnaire first",
      });
    }

    const prompt = generateWorkoutPrompt(user, preferences);
    const formattedContent = await generateWithRetry(prompt, "workout");

    const workoutPlan = await WorkoutPlan.create({
      userId: user.id,
      preferencesId: preferences._id,
      schedule: formattedContent.schedule,
      totals: formattedContent.totals,
      durationWeeks: parseInt(preferences.timePeriod.match(/\d+/)[0]),
      metadata: {
        equipment: preferences.equipment,
        availableTime: preferences.availableTimePerDay,
      },
    });

    res.status(201).json({
      success: true,
      data: workoutPlan,
    });
  } catch (error) {
    console.error("Workout plan error:", error.message);

    // Fallback handling
    if (error.message.includes("Failed to generate")) {
      const rawPlan = await WorkoutPlan.create({
        userId: req.user.id,
        rawContent: error.rawContent || "Generation failed",
        isUnstructured: true,
      });

      return res.status(206).json({
        success: true,
        data: rawPlan,
        warning: "Plan generated in basic format",
      });
    }

    next(error);
  }
};
