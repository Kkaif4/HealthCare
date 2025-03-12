import DietPreference from "../models/DietPreferences.js";
import User from "../models/User.js";
import DietPlan from "../models/OldDietPlan.js";
import { generateDietPrompt } from "../utils/OldpromptGenerator.js";
import initializeModel from "../config/gemini.js";
import { formatAndStoreDietPlan } from "../utils/OlddietResponseFormatter.js";
const geminiModel = initializeModel();

const MAX_RETRIES = 2;

// Common generator with retry logic
const generateWithRetry = async (prompt, planType, userId, preferences) => {
  let attempts = 0;
  const MAX_RETRIES = 2; // Match this with your existing MAX_RETRIES value
  const RETRY_DELAY = 2000; // 2 seconds delay between retries

  while (attempts < MAX_RETRIES) {
    try {
      console.log(
        `Attempt ${attempts + 1}/${MAX_RETRIES} for ${planType} plan generation`
      );

      // Get response from Gemini
      const result = await geminiModel.generateContent(prompt);

      if (!result || !result.response) {
        console.error("Empty response from Gemini API");
        throw new Error("Empty response from Gemini API");
      }

      const response = result.response;

      // Check how to correctly extract text from the response
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

      // Format and store response - add await here!
      const formatted = await formatAndStoreDietPlan(
        responseText,
        userId,
        preferences
      );

      console.log(`Plan formatted with type:`, formatted?.type || "undefined");

      // CRITICAL FIX: Don't rely on type check, since the formatted plan
      // is successfully created and we want to return it regardless
      if (formatted) {
        console.log("Successfully generated plan");
        return formatted;
      } else {
        throw new Error("Failed to format plan");
      }
    } catch (error) {
      attempts++;
      console.error(
        `Generation error (Attempt ${attempts}/${MAX_RETRIES}):`,
        error.message
      );

      // If we've reached the max retries, throw the error
      if (attempts >= MAX_RETRIES) {
        console.error(`All ${MAX_RETRIES} attempts failed`);
        throw new Error(
          `Failed after ${MAX_RETRIES} retries: ${error.message}`
        );
      }

      // Add a delay before the next retry
      console.log(`Waiting ${RETRY_DELAY}ms before next attempt...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }

  // This should never be reached, but just in case
  throw new Error(`Failed after ${MAX_RETRIES} retries`);
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

// Generate diet plan
export const generateDietPlan = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user.id;
    const preferences = await DietPreference.findOne({ userId });

    if (!preferences) {
      return res.status(400).json({
        success: false,
        error: "Complete preferences questionnaire first",
      });
    }

    const prompt = generateDietPrompt(user, preferences);
    const formattedContent = await generateWithRetry(
      prompt,
      "diet",
      userId,
      preferences
    );
    await DietPlan.deleteMany({ userId });
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
      message: "diet plan Successfully created",
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

export const getDietPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // const user = await User.findById(req.user.id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ success: false, error: "User not found" });
    }
    console.log(user._id);
  } catch (err) {}
};
