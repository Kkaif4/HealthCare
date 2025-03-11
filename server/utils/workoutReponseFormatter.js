import WorkoutPlan from "../models/WorkoutPlan.js";
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
export const formatAndStoreWorkoutPlan = async (rawResponse, userId, preferences) => {
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
          fitnessGoal: preferences.fitnessGoal,
          experienceLevel: preferences.experienceLevel,
          workoutDuration: preferences.workoutDuration,
          daysPerWeek: preferences.daysPerWeek,
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
        summary: {
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
    response.includes("Summary") ||
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
  // Initialize return objects
  const schedule = [];
  const summary = {
    totalSessions: 0,
    focusAreas: [],
    estimatedCalories: 0,
  };

  try {
    // Split into lines for processing
    const lines = response.split("\n").filter((line) => line.trim().length > 0);

    // Process each line
    let currentDay = null;
    let inSummarySection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check for day headers
      if (
        line.match(/^(Day|Week)\s*\d+/i) ||
        line.match(
          /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i
        )
      ) {
        currentDay = {
          day: line,
          exercises: [],
          notes: "",
        };
        schedule.push(currentDay);
        continue;
      }

      // Check for summary section
      if (line.match(/^Summary/i) || line.match(/^Overview/i)) {
        inSummarySection = true;
        continue;
      }

      // Process exercise lines if we're in a day
      if (currentDay && !inSummarySection) {
        // Check if line contains exercise information
        if (
          line.includes("x") ||
          line.includes("sets") ||
          line.includes("reps") ||
          line.includes("min") ||
          line.includes("sec")
        ) {
          const exercise = parseExerciseLine(line);
          if (exercise) {
            currentDay.exercises.push(exercise);
          }
        } else if (currentDay.exercises.length > 0) {
          // If not an exercise, and we already have exercises, treat as notes
          currentDay.notes += line + " ";
        }
      }

      // Process summary information
      if (inSummarySection) {
        processSummaryLine(line, summary);
      }
    }

    // Count total sessions
    summary.totalSessions = schedule.length;

    // If no focus areas were found, derive them from exercise names
    if (summary.focusAreas.length === 0) {
      const allExercises = schedule.flatMap((day) =>
        day.exercises.map((ex) => ex.name)
      );
      summary.focusAreas = deriveBodyPartFocus(allExercises);
    }

    return { schedule, summary };
  } catch (error) {
    console.error("Error parsing workout response:", error);
    return {
      schedule: [],
      summary: {
        totalSessions: 0,
        focusAreas: [],
        estimatedCalories: 0,
      },
    };
  }
};

/**
 * Parse a single line containing exercise information
 * @param {String} line - Line of text with exercise details
 * @returns {Object|null} - Parsed exercise or null if not parseable
 */
const parseExerciseLine = (line) => {
  try {
    // Try to extract exercise details using regex patterns

    // Pattern for standard lifting format: Exercise name: 3x12 (sets x reps)
    const liftingMatch = line.match(/(.+?):\s*(\d+)\s*x\s*(\d+)/i);
    if (liftingMatch) {
      return {
        name: liftingMatch[1].trim(),
        sets: parseInt(liftingMatch[2]),
        reps: parseInt(liftingMatch[3]),
        duration: null,
        rest: extractRest(line),
      };
    }

    // Pattern for time-based exercises: Exercise name: 30 sec/3 min
    const timeMatch = line.match(/(.+?):\s*(\d+)\s*(sec|min)/i);
    if (timeMatch) {
      return {
        name: timeMatch[1].trim(),
        sets: 1, // Default to 1 set for time-based exercises
        reps: null,
        duration: {
          value: parseInt(timeMatch[2]),
          unit: timeMatch[3].toLowerCase(),
        },
        rest: extractRest(line),
      };
    }

    // Fallback - try to split on common separators
    if (line.includes("-") || line.includes(":")) {
      const parts = line.split(/[-:]/);
      if (parts.length >= 2) {
        return {
          name: parts[0].trim(),
          details: parts.slice(1).join(" ").trim(),
          // These are fallbacks when structured parsing fails
          sets: extractNumber(line, "sets") || null,
          reps: extractNumber(line, "reps") || null,
          duration: extractDuration(line),
          rest: extractRest(line),
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error parsing exercise line:", error);
    return null;
  }
};

/**
 * Process a line from the summary section
 * @param {String} line - Line from summary section
 * @param {Object} summary - Summary object to update
 */
const processSummaryLine = (line, summary) => {
  const lowerLine = line.toLowerCase();

  // Extract focus areas
  if (lowerLine.includes("focus") || lowerLine.includes("target")) {
    const bodyParts = [
      "chest",
      "back",
      "legs",
      "shoulders",
      "arms",
      "core",
      "abs",
      "cardio",
      "full body",
      "upper body",
      "lower body",
      "biceps",
      "triceps",
      "quads",
      "hamstrings",
      "glutes",
    ];

    for (const part of bodyParts) {
      if (lowerLine.includes(part)) {
        if (!summary.focusAreas.includes(part)) {
          summary.focusAreas.push(part);
        }
      }
    }
  }

  // Extract estimated calories
  const calorieMatch = line.match(/(\d+)\s*calories/i);
  if (calorieMatch) {
    summary.estimatedCalories = parseInt(calorieMatch[1]);
  }
};

/**
 * Extract rest time from a line
 * @param {String} line - Line of text
 * @returns {Object|null} - Rest time object or null
 */
const extractRest = (line) => {
  const restMatch = line.match(/rest\s*:?\s*(\d+)\s*(sec|min)/i);
  if (restMatch) {
    return {
      value: parseInt(restMatch[1]),
      unit: restMatch[2].toLowerCase(),
    };
  }
  return null;
};

/**
 * Extract a number with a specific label from text
 * @param {String} text - Text to search in
 * @param {String} label - Label to look for (sets, reps, etc.)
 * @returns {Number|null} - Extracted number or null
 */
const extractNumber = (text, label) => {
  const regex = new RegExp(`(\\d+)\\s*${label}`, "i");
  const match = text.match(regex);
  return match ? parseInt(match[1]) : null;
};

/**
 * Extract duration information from text
 * @param {String} text - Text to search in
 * @returns {Object|null} - Duration object or null
 */
const extractDuration = (text) => {
  const minMatch = text.match(/(\d+)\s*min/i);
  if (minMatch) {
    return { value: parseInt(minMatch[1]), unit: "min" };
  }

  const secMatch = text.match(/(\d+)\s*sec/i);
  if (secMatch) {
    return { value: parseInt(secMatch[1]), unit: "sec" };
  }

  return null;
};

/**
 * Derive body part focus from exercise names
 * @param {Array} exerciseNames - List of exercise names
 * @returns {Array} - List of body parts
 */
const deriveBodyPartFocus = (exerciseNames) => {
  const focusAreas = new Set();
  const bodyPartMap = {
    chest: ["chest", "bench", "push-up", "pushup", "dip", "flye", "press"],
    back: ["back", "row", "pull-up", "pullup", "pulldown", "deadlift", "lat"],
    legs: [
      "leg",
      "squat",
      "lunge",
      "calf",
      "extension",
      "curl",
      "raise",
      "press",
    ],
    shoulders: ["shoulder", "deltoid", "press", "raise", "lateral", "overhead"],
    arms: ["bicep", "tricep", "curl", "extension", "arm"],
    core: ["core", "ab", "crunch", "plank", "twist", "russian", "situp"],
  };

  exerciseNames.forEach((name) => {
    const lowerName = name.toLowerCase();

    for (const [bodyPart, keywords] of Object.entries(bodyPartMap)) {
      for (const keyword of keywords) {
        if (lowerName.includes(keyword)) {
          focusAreas.add(bodyPart);
          break;
        }
      }
    }
  });

  if (focusAreas.size === 0) {
    return ["full body"]; // Default if no specific focus is identified
  }

  return [...focusAreas];
};