import WorkoutPlan from "../models/WorkoutPlan.js";
import initializeModel from "../config/gemini.js";
import WorkoutPreferences from "../models/WorkoutPreferences.js";
import { generateWorkoutPrompt } from "../utils/promptGenerator.js";
import { formatAndStoreWorkoutPlan } from "../utils/workoutReponseFormatter.js";
import { formatAndStoreDietPlan } from "../utils/dietResponseFormatter.js";
const geminiModel = initializeModel();

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
    await WorkoutPreferences.deleteMany({ userId });

    // Create new preferences
    const preferences = await WorkoutPreferences.create({
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

/**
 * General function for generating with retry logic
 * @param {Function} prompt - Function that generates a prompt
 * @param {String} planType - Type of plan (workout or diet)
 * @param {Object} preferences - User preferences
 * @param {Number} maxRetries - Maximum number of retry attempts
 * @returns {Object} - Generated plan
 */
const generateWithRetry = async (
  prompt,
  planType,
  userId,
  preferences,
  maxRetries = 2
) => {
  let attempts = 0;
  const RETRY_DELAY = 2000; // 2 seconds delay between retries

  while (attempts < maxRetries) {
    try {
      console.log(
        `Attempt ${attempts + 1}/${maxRetries} for ${planType} plan generation`
      );

      // Get response from Gemini
      const result = await geminiModel.generateContent(prompt);

      if (!result || !result.response) {
        console.error("Empty response from Gemini API");
        throw new Error("Empty response from Gemini API");
      }

      const response = result.response;

      // Extract text from response
      let responseText;
      if (typeof response.text === "function") {
        responseText = response.text();
      } else {
        responseText = response.text;
      }

      if (!responseText) {
        console.error("Empty text in Gemini response");
        throw new Error("Empty text in Gemini response");
      }

      // Format and store response based on plan type
      let formatted;
      if (planType === "workout") {
        formatted = await formatAndStoreWorkoutPlan(
          responseText,
          userId,
          preferences
        );
      } else if (planType === "diet") {
        formatted = await formatAndStoreDietPlan(
          responseText,
          userId,
          preferences
        );
      } else {
        throw new Error(`Unsupported plan type: ${planType}`);
      }

      console.log(`Plan formatted with type:`, formatted?.type || "undefined");

      // Return the formatted plan
      if (formatted) {
        console.log("Successfully generated plan");
        return formatted;
      } else {
        throw new Error("Failed to format plan");
      }
    } catch (error) {
      attempts++;
      console.error(
        `Generation error (Attempt ${attempts}/${maxRetries}):`,
        error.message
      );

      // If we've reached the max retries, throw the error
      if (attempts >= maxRetries) {
        console.error(`All ${maxRetries} attempts failed`);
        throw new Error(`Failed after ${maxRetries} retries: ${error.message}`);
      }

      // Add a delay before the next retry
      console.log(`Waiting ${RETRY_DELAY}ms before next attempt...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }

  throw new Error(`Failed after ${maxRetries} retries`);
};

/**
 * Generate a workout plan for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with workout plan
 */
const generateWorkoutPlan = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id;
    const preferences = await WorkoutPreferences.findOne({ userId });

    if (!preferences) {
      return res.status(400).json({
        success: false,
        error: "Complete preferences questionnaire first",
      });
    }
    const prompt = generateWorkoutPrompt(user, preferences);
    const formattedContent = await generateWithRetry(
      prompt,
      "workout",
      userId,
      preferences
    );
    console.log(formattedContent);
    const workoutPlan = await WorkoutPlan.create({
      userId,
      preferencesId: preferences._id,
      schedule: formattedContent.schedule,
      totals: formattedContent.totals,
      durationWeeks: parseInt(preferences.timePeriod.match(/\d+/)[0]),
      metadata: {
        equipment: preferences.equipment,
      },
    });
    console.log('workout plan created');
    console.log(workoutPlan);
    res.status(201).json({
      success: true,
      message:"Workout plan created successfully",
      data: workoutPlan,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all workout plans for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with workout plans
 */
const getUserWorkoutPlans = async (req, res) => {
  try {
    const { userId } = req.params;

    const workoutPlans = await WorkoutPlan.find({
      userId,
      status: { $ne: "archived" },
    }).sort({ generatedAt: -1 });

    res.status(200).json({
      success: true,
      count: workoutPlans.length,
      data: workoutPlans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get a single workout plan by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with workout plan
 */
const getWorkoutPlan = async (req, res) => {
  try {
    const { planId } = req.params;

    const workoutPlan = await WorkoutPlan.findById(planId);
    if (!workoutPlan) {
      return res
        .status(404)
        .json({ success: false, message: "Workout plan not found" });
    }

    res.status(200).json({
      success: true,
      data: workoutPlan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { generateWorkoutPlan, getUserWorkoutPlans, getWorkoutPlan };
