import WorkoutPlan from "../models/OldWorkoutPlan.js";
// Workout Plan Response Formatter
/**
 * Checks if the AI response is structured correctly for a workout plan
 * @param {String} response - Raw response from AI
 * @returns {Boolean} - True if structured, false otherwise
 */

//workout plan structure
// workoutFormatter
/**
 * Formats and stores workout plan response from Gemini API
 * @param {String} rawResponse - The raw response from Gemini API
 * @param {String} userId - ID of the user this workout plan belongs to
 * @param {Object} preferences - Workout preferences used to generate the prompt
 * @returns {Object} - The saved workout plan document
 */
export const formatAndStoreWorkoutPlan = async (
  rawResponse,
  userId,
  preferences
) => {
  try {
    console.log("Formatting workout plan response...");

    if (!rawResponse || typeof rawResponse !== "string") {
      console.error("Invalid response format:", typeof rawResponse);
      throw new Error("Invalid response format from Gemini API");
    }

    // Check if we can parse the response as expected
    const isStructured = isStructuredResponse(rawResponse);
    console.log("Response is structured:", isStructured);

    let workoutPlanData;

    if (isStructured) {
      // Parse the structured response
      const { schedule, summary } = parseStructuredWorkoutResponse(rawResponse);

      // Create workout plan document
      workoutPlanData = {
        userId,
        preferencesId: preferences._id,
        generatedAt: new Date(),
        status: "active",
        schedule,
        summary,
        metadata: {
          fitnessGoal: preferences.workoutGoal,
          experienceLevel: preferences.experience,
          workoutDuration: preferences.duration,
          daysPerWeek: preferences.workoutDaysPerWeek,
        },
        isUnstructured: false,
        rawContent: rawResponse,
        type: "workout", // Set type directly
      };
    } else {
      // If response is not properly structured, save as unstructured
      console.warn(
        "Received unstructured workout plan response from Gemini API"
      );
      workoutPlanData = {
        userId,
        preferencesId: preferences._id,
        generatedAt: new Date(),
        status: "active",
        schedule: [],
        totals: {
          totalSessions: 0,
          focusAreas: [],
          estimatedCalories: 0,
        },
        metadata: {
          fitnessGoal: preferences.fitnessGoal,
          experienceLevel: preferences.experienceLevel,
          workoutDuration: preferences.workoutDuration,
          daysPerWeek: preferences.daysPerWeek,
        },
        isUnstructured: true,
        rawContent: rawResponse,
        type: "workout", // Set type directly
      };
    }

    // Save to database
    console.log("Saving workout plan to database...");
    const workoutPlan = new WorkoutPlan(workoutPlanData);
    const savedPlan = await workoutPlan.save();

    // Explicitly add type property to the returned object
    const returnPlan = savedPlan.toObject ? savedPlan.toObject() : savedPlan;
    returnPlan.type = "workout";

    console.log("Workout plan saved successfully with type:", returnPlan.type);
    return returnPlan;
  } catch (error) {
    console.error("Error formatting and storing workout plan:", error);
    throw error;
  }
};

/**
 * Checks if the response follows the expected structured format for workouts
 * @param {String} response - Raw response from Gemini API
 * @returns {Boolean} - Whether response is structured as expected
 */
const isStructuredResponse = (response) => {
  // Check if response contains both workout schedule and summary information
  const hasWorkoutSchedule =
    response.includes("Day") &&
    (response.includes("Exercise") || response.includes("Workout")) &&
    (response.includes("Sets") ||
      response.includes("Reps") ||
      response.includes("Duration"));

  const hasSummary =
    response.includes("TOTALS") ||
    response.includes("Weekly Workout Duration") ||
    response.includes("Total Sessions") ||
    response.includes("Focus Areas");

  return hasWorkoutSchedule && hasSummary;
};

/**
 * Parses a structured workout response from Gemini API
 * @param {String} response - Raw response from Gemini API
 * @returns {Object} - Parsed schedule and summary
 */
const parseStructuredWorkoutResponse = (response) => {
  const sections = response.split(/###\s+/);
  const scheduleSection = sections.find(
    (section) =>
      section.startsWith("WEEKLY_SCHEDULE") ||
      section.includes("Day | Workout Type | Exercises")
  );
  const totalSection = sections.find(
    (section) =>
      section.startsWith("TOTALS") ||
      section.includes("Weekly Workout Duration")
  );
  const schedule = parseWorkoutScheduleSection(scheduleSection);
  const totals = parseWorkoutTotalsSection(totalSection);
  return { schedule, totals };
};

const parseWorkoutScheduleSection = (scheduleSection) => {
  if (!scheduleSection) return [];

  const lines = scheduleSection
    .split("\n")
    .filter((line) => line.trim() !== "")
    .filter((line) => line.includes("|"))
    .filter((line) => !line.includes("Day | Workout Type | Exercises"));

  return lines
    .map((line) => {
      const parts = line.split("|").map((part) => part.trim());
      if (parts.length < 7) {
        return null;
      }
      return {
        day: parts[0],
        workoutType: parts[1],
        exercises: parts[2],
        duration: parts[3],
        rest: line,
        sets: parseInt(parts[4]),
        reps: parts[5],
        intensity: parts[6],
      };
    })
    .filter(Boolean);
};

const parseWorkoutTotalsSection = (totalsSection) => {
  if (!totalsSection) {
    return {
      weeklyWorkoutDuration: 0,
      totalSessions: 0,
      focusAreas: "",
    };
  }

  // Initialize totals object
  const totals = {
    weeklyWorkoutDuration: 0,
    totalSessions: 0,
    focusAreas: "",
  };

  // Extract values using regex
  const durationMatch = totalsSection.match(/Weekly Workout Duration:\s*(\d+)/);
  if (durationMatch) totals.weeklyWorkoutDuration = parseInt(durationMatch[1]);

  const sessionsMatch = totalsSection.match(/Total Sessions:\s*(\d+)/);
  if (sessionsMatch) totals.totalSessions = parseInt(sessionsMatch[1]);

  const focusAreasMatch = totalsSection.match(/Focus Areas:\s*(.+)/);
  if (focusAreasMatch) totals.focusAreas = focusAreasMatch[1].trim();

  return totals;
};
