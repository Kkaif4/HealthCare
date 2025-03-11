// responseFormatter.js

import DietPlan from "../models/DietPlan.js";

// Diet Plan Response Formatter
/**
 * Formats and stores diet plan response from Gemini API
 * @param {String} rawResponse - The raw response from Gemini API
 * @param {String} userId - ID of the user this diet plan belongs to
 * @param {Object} preferences - Diet preferences used to generate the prompt
 * @returns {Object} - The saved diet plan document with type property
 */
export const formatAndStoreDietPlan = async (rawResponse, userId, preferences) => {
  try {
    console.log("Formatting diet plan response...");

    if (!rawResponse || typeof rawResponse !== "string") {
      console.error("Invalid response format:", typeof rawResponse);
      throw new Error("Invalid response format from Gemini API");
    }

    // First check if we can parse the response as expected
    const isStructured = isStructuredDietResponse(rawResponse);
    console.log("Response is structured:", isStructured);

    let dietPlanData;

    if (isStructured) {
      // Parse the structured response
      const { schedule, totals } = parseStructuredDietResponse(rawResponse);

      // Create diet plan document
      dietPlanData = {
        userId,
        preferencesId: preferences._id, // Assuming preferences has an _id
        generatedAt: new Date(),
        status: "active",
        schedule,
        totals,
        metadata: {
          targetWeight: preferences.targetWeight,
          timePeriod: preferences.timePeriod,
          dietType: preferences.dietType,
        },
        isUnstructured: false,
        rawContent: rawResponse,
        // Add type directly to the database document
        type: "diet",
      };
    } else {
      // If response is not properly structured, save as unstructured
      console.warn("Received unstructured diet plan response from Gemini API");
      dietPlanData = {
        userId,
        preferencesId: preferences._id,
        generatedAt: new Date(),
        status: "active",
        schedule: [],
        totals: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
        },
        metadata: {
          targetWeight: preferences.targetWeight,
          timePeriod: preferences.timePeriod,
          dietType: preferences.dietType,
        },
        isUnstructured: true,
        rawContent: rawResponse,
        // Add type directly to the database document
        type: "diet",
      };
    }

    // Save to database
    console.log("Saving diet plan to database...");
    const dietPlan = new DietPlan(dietPlanData);
    const savedPlan = await dietPlan.save();

    // Explicitly add type property to the returned object if not included in schema
    const returnPlan = savedPlan.toObject ? savedPlan.toObject() : savedPlan;
    returnPlan.type = "diet";

    console.log("Diet plan saved successfully with type:", returnPlan.type);
    return returnPlan;
  } catch (error) {
    console.error("Error formatting and storing diet plan:", error);
    throw error;
  }
};
/**
 * Checks if the response follows the expected structured format
 * @param {String} response - Raw response from Gemini API
 * @returns {Boolean} - Whether response is structured as expected
 */
const isStructuredDietResponse = (response) => {
  // Check if response contains both schedule table and totals
  const hasDailySchedule =
    response.includes(
      "Time | Meal Type | Food Items | Quantity | Calories | Protein | Carbs"
    ) || response.includes("DAILY_SCHEDULE");
  const hasTotals =
    response.includes("TOTALS") ||
    (response.includes("Daily Calories") &&
      response.includes("Total Protein") &&
      response.includes("Total Carbs") &&
      response.includes("Total Fats"));

  return hasDailySchedule && hasTotals;
};

/**
 * Parses a structured diet response from Gemini API
 * @param {String} response - Raw response from Gemini API
 * @returns {Object} - Parsed schedule and totals
 */
const parseStructuredDietResponse = (response) => {
  // Split the response into sections (schedule and totals)
  const sections = response.split(/###\s+/);

  // Parse schedule section
  const scheduleSection = sections.find(
    (section) =>
      section.startsWith("DAILY_SCHEDULE") ||
      section.includes("Time | Meal Type | Food Items")
  );

  // Parse totals section
  const totalsSection = sections.find(
    (section) =>
      section.startsWith("TOTALS") || section.includes("Daily Calories")
  );

  // Extract schedule data
  const schedule = parseDietScheduleSection(scheduleSection);

  // Extract totals data
  const totals = parseDietTotalsSection(totalsSection);

  return { schedule, totals };
};

/**
 * Parses the schedule section from the response
 * @param {String} scheduleSection - Schedule section of the response
 * @returns {Array} - Array of meal objects
 */
const parseDietScheduleSection = (scheduleSection) => {
  if (!scheduleSection) return [];

  // Split into lines and remove header rows
  const lines = scheduleSection
    .split("\n")
    .filter((line) => line.trim() !== "")
    .filter((line) => line.includes("|"))
    .filter((line) => !line.includes("Time | Meal Type")); // Remove header row

  // Parse each line into a meal object
  return lines
    .map((line) => {
      const parts = line.split("|").map((part) => part.trim());

      // Ensure we have the expected number of parts
      if (parts.length < 7) {
        return null;
      }

      return {
        time: parts[0],
        mealType: parts[1],
        dishName: parts[2], // Using Food Items as dishName
        ingredients: [], // Not directly provided in the schedule
        quantity: parts[3],
        calories: parseFloat(parts[4]) || 0,
        protein: parseFloat(parts[5]) || 0,
        // Note: We're not capturing carbs separately as it's in the schema
        // but we could add it if needed
      };
    })
    .filter((meal) => meal !== null);
};

/**
 * Parses the totals section from the response
 * @param {String} totalsSection - Totals section of the response
 * @returns {Object} - Totals object with calories, protein, carbs, fats
 */
const parseDietTotalsSection = (totalsSection) => {
  if (!totalsSection) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    };
  }

  // Initialize totals object
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  };

  // Extract values using regex
  const caloriesMatch = totalsSection.match(/Daily Calories:\s*(\d+)/);
  if (caloriesMatch) totals.calories = parseInt(caloriesMatch[1]);

  const proteinMatch = totalsSection.match(/Total Protein:\s*(\d+)/);
  if (proteinMatch) totals.protein = parseInt(proteinMatch[1]);

  const carbsMatch = totalsSection.match(/Total Carbs:\s*(\d+)/);
  if (carbsMatch) totals.carbs = parseInt(carbsMatch[1]);

  const fatsMatch = totalsSection.match(/Total Fats:\s*(\d+)/);
  if (fatsMatch) totals.fats = parseInt(fatsMatch[1]);

  return totals;
};
