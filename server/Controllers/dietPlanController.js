import DietPreference from "../models/DietPreferences.js";
import DietPlanModel from "../models/DietPlanModel.js";
import { generateDietPrompt } from "../utils/OldpromptGenerator.js";
import initializeModel from "../config/gemini.js";

const geminiModel = initializeModel();

const MAX_RETRIES = 2;

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
    console.log("new preferences created");
    res.status(201).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    console.error("Error saving preferences:", error.message);
    next(error);
  }
};

