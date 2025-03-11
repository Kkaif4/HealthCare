// responseFormatter.js
export const formatPlanResponse = (generatedText) => {
  // console.log("generatedText: ", generatedText);
  const isDietPlan = /### DAILY_SCHEDULE/i.test(generatedText);
  const isWorkoutPlan = /### WEEKLY_SCHEDULE/i.test(generatedText);
  try {
    if (typeof generatedText !== "string" || !generatedText.trim()) {
      console.log("Invalid input: generatedText must be a non-empty string");
      throw new Error(
        "Invalid input: generatedText must be a non-empty string"
      );
    }
    if (isDietPlan) {
      return parseDietPlan(generatedText);
    }
    if (isWorkoutPlan) {
      return parseWorkoutPlan(generatedText);
    }
    console.warn(
      "No valid plan format detected, falling back to generic parsing."
    );
    return fallbackParse(generatedText);
  } catch (error) {
    console.log("format plan response error");
    console.error("Parsing failed:", error.message);
    return fallbackParse(generatedText, error);
  }
};

const parseDietSchedule = (scheduleText) => {
  if (typeof scheduleText !== "string" || !scheduleText.trim()) {
    console.error("Invalid schedule text it should be a string");
    throw new Error("Invalid schedule text it should be a string");
  }
  const lines = scheduleText
    .split("\n")
    .filter((line) => line.trim() && line.includes("|"));

  if (lines.length === 0) return [];
  return lines
    .map((line) => {
      const columns = line.split("|").map((c) => c.trim());
      return {
        time: columns[0] || "N/A",
        mealType: columns[1] || "Unknown",
        foodItems: columns[2] || "",
        quantity: columns[3] || "",
        calories: parseNutritionValue(columns[4]),
        protein: parseNutritionValue(columns[5]),
        carbs: parseNutritionValue(columns[6]),
        extras: columns.slice(7),
      };
    })
    .filter(
      (meal) => meal.time !== "N/A" && meal.time.toLowerCase() !== "time"
    );
};

const parseWorkoutSchedule = (scheduleText) => {
  console.log("content", scheduleText);
  console.log("type", typeof scheduleText);
  if (typeof scheduleText !== "string" || !scheduleText.trim()) {
    console.error("Invalid schedule text it should be a string");
    throw new Error("Invalid schedule text it should be a string");
  }
  return scheduleText
    .split("\n")
    .filter((line) => line.trim())
    .map((line, index) => {
      const columns = line.split("|").map((c) => c.trim());

      if (!validateColumns(columns, 5, index + 1)) return null;

      return {
        day: columns[0]?.trim() || "Unspecified",
        workoutType: columns[1]?.trim() || "General",
        exercise: columns[2]?.split(",").map((c) => c.trim()) || [],
        setReps: columns[3]?.trim() || "3x12",
        duration: columns[4]?.trim() || "45 mins",
        intensity: columns[5]?.trim() || "Medium",
      };
    })
    .filter((workout) => workout?.day !== "Unspecified");
};

// Diet Plan Parser
const parseDietPlan = (text) => {
  const scheduleSection = getSection(text, "DAILY_SCHEDULE");
  const totalsSection = getSection(text, "TOTALS");
  console.log("Schedule section:", scheduleSection);
  const line = scheduleSection.split("\n").filter((line) => line.trim());
  if (line.length === 0) {
    console.log("Empty schedule section");
    throw new Error("Empty schedule section");
  }
  const requiredColumns = [
    "time",
    "meal type",
    "food items",
    "quantity",
    "calories",
    "protein",
    "carbs",
  ];

  // Use parseSchedule with expected columns
  if (scheduleSection.length < 10 || totalsSection.length < 5) {
    console.log("Incorrect section detected");
    throw new Error("Incomplete sections detected");
  }
  const [headerLine, ...mealLine] = line;
  if (!/(time)\s*\|.*(meal type)/i.test(headerLine)) {
    console.log("Invalid header format:", headerLine);
    throw new Error("Invalid header format: " + headerLine);
  }
  // Basic header validation
  if (
    !headerLine.toLowerCase().includes("time") ||
    !headerLine.toLowerCase().includes("meal")
  ) {
    console.log("Invalid header: " + headerLine);
    throw new Error(`Invalid header: ${headerLine}`);
  }
  console.log("Raw meal lines:", mealLine);
  const headerColumns = headerLine
    .toLowerCase()
    .split("|")
    .map((c) => c.trim());
  // Check for missing columns in header
  const missingColumns = requiredColumns.filter(
    (keyword) => !headerColumns.some((hc) => hc.toLowerCase() === keyword)
  );

  if (missingColumns.length > 0) {
    console.log("Missing columns in header");
    throw new Error(
      `Missing columns: ${missingColumns.join(", ")} in header: ${headerLine}`
    );
  }
  const rawMeals = parseDietSchedule(mealLine, 7).filter(
    (meal) => meal.time !== "Meal 1"
  );
  const meals = rawMeals.map((meal) => ({
    time: meal.time,
    mealType: meal.mealType,
    dishName: meal.foodItems.split(",")[0] || "Mixed meal", // Use first food item as dish name
    ingredients: meal.foodItems.split(",").map((item) => item.trim()), // Convert food items to array
    quantity: meal.quantity,
    calories: meal.calories,
    protein: meal.protein,
  }));

  console.log("Parsed meals:", meals);
  if (meals.length === 0) {
    console.error("Empty schedule parsed from:", scheduleSection);
    throw new Error("No valid meals found in schedule");
  }

  const totals = parseTotals(totalsSection);
  const finalTotals = {
    calories: totals.calories || sumValues(meals, "calories"),
    protein: totals.protein || sumValues(meals, "protein"),
    carbs: totals.carbs || sumValues(meals, "carbs"),
    fat: totals.fat || sumValues(meals, "fat") || 0,
    ...totals,
  };
  return { type: "diet", schedule: meals, totals: finalTotals };
};

// Workout Plan Parser
const parseWorkoutPlan = (text) => {
  try {
    const scheduleSection = getSection(text, "WEEKLY_SCHEDULE");
    const totalsSection = getSection(text, "TOTALS");

    if (!scheduleSection) {
      console.error("Missing weekly schedule section");
      return fallbackParse(text);
    }

    // Parse workout data
    const workouts = parseWorkoutSchedule(scheduleSection);

    if (workouts.length === 0) {
      console.error("No valid workouts parsed");
      return fallbackParse(text);
    }
    const formattedWorkouts = workouts.map((workout) => ({
      day: workout.day,
      focus: workout.focus,
      exercises: workout.exercise,
      setsReps: workout.setReps,
      duration: workout.duration,
      intensity: workout.intensity,
    }));

    // Parse or create totals
    const totals = parseTotals(totalsSection);
    const finalTotals = {
      weeklySessions: formattedWorkouts.length,
      totalHours: calculateTotalHours(formattedWorkouts),
      avgCalories: totals.calories || estimateCalories(formattedWorkouts),
    };
    return {
      type: "workout",
      schedule: formattedWorkouts,
      totals: finalTotals,
    };
  } catch {
    console.error("Error parsing workout schedule");
    return fallbackParse(text);
  }
};

//heper function
const calculateTotalHours = (workouts) => {
  let totalMins = 0;

  workouts.forEach((workout) => {
    const durationStr = WorkoutPreferences.duration;
    const minutesMatch = durationStr.match(/(\d+)\s*mins?/i);
    const hoursMatch = durationStr.match(/(\d+)\s*hours?/i);

    if (minutesMatch) {
      totalMins += parseInt(minutesMatch[1]);
    }
    if (hoursMatch) {
      totalMins += parseInt(hoursMatch[1]) * 60;
    } else {
      totalMins += 45;
    }
  });
  return parseFloat(totalMins / 60).toFixed(2);
};

// Helper to calculate single workout duration in minutes
const calculateWorkoutDuration = (durationStr) => {
  if (!durationStr) return 45; // Default

  const minutesMatch = durationStr.match(/(\d+)\s*mins?/i);
  const hoursMatch = durationStr.match(/(\d+)\s*hours?/i);

  if (minutesMatch) return parseInt(minutesMatch[1]);
  if (hoursMatch) return parseInt(hoursMatch[1]) * 60;
  return 45; // Default
};
//helper function
const estimateCalories = (workouts) => {
  let totalCalories = 0;

  workouts.forEach((workout) => {
    const duration = calculateWorkoutDuration(workout.duration);
    let caloriesPerHour = 300; // Default moderate intensity

    if (workout.intensity) {
      const intensity = workout.intensity.toLowerCase();
      if (intensity.includes("high")) caloriesPerHour = 500;
      else if (intensity.includes("low")) caloriesPerHour = 200;
    }

    totalCalories += (duration / 60) * caloriesPerHour;
  });

  return Math.round(totalCalories / workouts.length);
};

// Helper functions
const getSection = (text, sectionName) => {
  // New robust regex pattern
  const regex = new RegExp(
    `^###\\s*${sectionName}\\b[\\s\\S]*?\\n([\\s\\S]*?)(?=^###\\s|$)`,
    "gmi"
  );

  const match = regex.exec(text);
  if (!match || !match[1]) {
    console.error(`Missing ${sectionName} section in:\n${text.slice(0, 200)}`);
    return "";
  }
  return match[1].trim() || "";
};

// Robust totals parser
const parseTotals = (totalsText) => {
  if (!totalsText) return {};

  const totals = {};
  totalsText.split("\n").forEach((line) => {
    // Handle different delimiters and formatting
    if (line.includes(":") || line.includes("=")) {
      const parts = line.split(/[:=]/).map((x) => x.trim());
      if (parts.length >= 2) {
        const key = parts[0].toLowerCase();
        const value = parts[1];

        if (key.includes("calorie"))
          totals.calories = parseNutritionValue(value);
        else if (key.includes("protein"))
          totals.protein = parseNutritionValue(value);
        else if (key.includes("carb"))
          totals.carbs = parseNutritionValue(value);
        else if (key.includes("fat")) totals.fats = parseNutritionValue(value);
        else if (key.includes("session"))
          totals.weeklySessions = parseNutritionValue(value);
        else if (key.includes("hours") || key.includes("time"))
          totals.totalHours = parseNutritionValue(value);
      }
    }
  });

  return totals;
};

//helper function
const sumValues = (meals, field) => {
  return meals.reduce((sum, meal) => sum + (meal[field] || 0), 0);
};

const parseNutritionValue = (value) => {
  if (!value) return 0; // Default value if no value is provided
  const numericValue = parseFloat(value.replace(/[^\d.]/g, "") || 0);
  return isNaN(numericValue) ? 0 : numericValue;
};

const validateColumns = (columns, expected, lineNumber) => {
  if (columns.length < expected) {
    console.warn(
      `Line ${lineNumber}: Expected ${expected} columns, found ${columns.length}`
    );
    return false;
  }
  return true;
};

// Fallback parser (add this at the bottom)
const fallbackParse = (text, error = null) => {
  console.log("Using fallback parser");
  // First check if it looks like a diet plan
  if (
    text.toLowerCase().includes("meal") ||
    text.toLowerCase().includes("diet")
  ) {
    // Attempt to extract meals from any format
    const entries = text
      .split("\n")
      .filter(
        (line) =>
          line.includes("|") ||
          (line.includes("meal") &&
            (line.includes("calories") || line.includes("protein")))
      )
      .filter((line) => line.trim());

    const schedule = entries
      .map((line) => {
        // Try to parse as table row first
        if (line.includes("|")) {
          const parts = line.split("|").map((x) => x.trim());
          return {
            time: parts[0] || "N/A",
            mealType: parts[1] || "Meal",
            dishName: (parts[2] || "Mixed meal").split(",")[0],
            ingredients: (parts[2] || "")
              .split(",")
              .map((i) => i.trim())
              .filter((i) => i),
            quantity: parts[3] || "1 serving",
            calories: parseNutritionValue(parts[4] || "0"),
            protein: parseNutritionValue(parts[5] || "0"),
          };
        }
        return {
          time: extractTimeFromText(line) || "N/A",
          mealType: extractMealTypeFromText(line) || "Meal",
          dishName: "Mixed meal",
          ingredients: extractIngredientsFromText(line),
          quantity: "1 serving",
          calories: extractCaloriesFromText(line),
          protein: extractProteinFromText(line),
        };
      })
      .filter((meal) => meal.time !== "N/A" && meal.ingredients.length > 0);

    // Extract totals
    const totals = {
      calories:
        extractTotalCaloriesFromText(text) || sumValues(schedule, "calories"),
      protein:
        extractTotalProteinFromText(text) || sumValues(schedule, "protein"),
      carbs: extractTotalCarbsFromText(text) || 0,
      fats: extractTotalFatsFromText(text) || 0,
    };

    return {
      type: "diet",
      schedule:
        schedule.length > 0
          ? schedule
          : [
              {
                time: "All day",
                mealType: "General diet",
                dishName: "Balanced meal",
                ingredients: ["Mixed ingredients"],
                quantity: "As needed",
                calories: 2000,
                protein: 100,
              },
            ],
      totals: totals,
      isUnstructured: true,
      rawContent: text,
    };
  } else {
    // Likely a workout plan
    const entries = text
      .split("\n")
      .filter(
        (line) =>
          line.includes("|") ||
          (line.toLowerCase().includes("day") &&
            (line.toLowerCase().includes("exercise") ||
              line.toLowerCase().includes("workout")))
      )
      .filter((line) => line.trim());

    const schedule = entries
      .map((line) => {
        // Try to parse as table row first
        if (line.includes("|")) {
          const parts = line.split("|").map((x) => x.trim());
          return {
            day: parts[0] || "Any day",
            focus: parts[1] || "Full body",
            exercises: parts[2]
              ? parts[2]
                  .split(",")
                  .map((e) => e.trim())
                  .filter((e) => e)
              : ["General exercise"],
            setsReps: parts[3] || "3x10",
            duration: parts[4] || "45 mins",
            intensity: parts[5] || "Medium",
          };
        }

        // Try to parse as free text
        return {
          day: extractDayFromText(line) || "Any day",
          focus: extractFocusFromText(line) || "Full body",
          exercises: extractExercisesFromText(line),
          setsReps: "3x10",
          duration: "45 mins",
          intensity: "Medium",
        };
      })
      .filter(
        (workout) => workout.day !== "Any day" || workout.exercises.length > 0
      );

    // Create default totals
    const totals = {
      weeklySessions: schedule.length,
      totalHours: calculateTotalHours(schedule),
      avgCalories: 300,
    };

    return {
      type: "workout",
      schedule:
        schedule.length > 0
          ? schedule
          : [
              {
                day: "Monday",
                focus: "Full body",
                exercises: ["Squats", "Push-ups", "Pull-ups"],
                setsReps: "3x10",
                duration: "45 mins",
                intensity: "Medium",
              },
            ],
      totals: totals,
      isUnstructured: true,
      rawContent: text,
    };
  }
};

// Text extraction helper functions
const extractTimeFromText = (text) => {
  const timePatterns = [
    /(?:at\s+)?(morning|breakfast|lunch|dinner|evening|afternoon|snack)/i,
    /(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i,
  ];

  for (const pattern of timePatterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }

  return null;
};

const extractMealTypeFromText = (text) => {
  const mealTypes = [
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "brunch",
    "supper",
  ];
  const lowercaseText = text.toLowerCase();

  for (const type of mealTypes) {
    if (lowercaseText.includes(type))
      return type.charAt(0).toUpperCase() + type.slice(1);
  }

  return "Meal";
};
const extractIngredientsFromText = (text) => {
  // Find food items in the text
  const foodItems = [];
  const words = text.split(/[,:]/).map((w) => w.trim());

  for (const word of words) {
    // Skip words that are likely not food
    if (
      word.match(
        /calories|protein|carbs|fat|grams|time|meal|breakfast|lunch|dinner/i
      )
    )
      continue;
    if (word.length > 3) foodItems.push(word);
  }

  return foodItems.length > 0 ? foodItems : ["Mixed ingredients"];
};

const extractCaloriesFromText = (text) => {
  const match = text.match(/(\d+)\s*(?:kcal|calories)/i);
  return match ? parseInt(match[1]) : 0;
};

const extractProteinFromText = (text) => {
  const match = text.match(
    /(\d+(?:\.\d+)?)\s*(?:g\s+protein|protein\s+\(?g\)?|protein)/i
  );
  return match ? parseFloat(match[1]) : 0;
};

const extractTotalCaloriesFromText = (text) => {
  const match =
    text.match(/total\s+calories\s*[:=]?\s*(\d+)/i) ||
    text.match(/calories\s*[:=]?\s*(\d+)/i);
  return match ? parseInt(match[1]) : null;
};

const extractTotalProteinFromText = (text) => {
  const match =
    text.match(/total\s+protein\s*[:=]?\s*(\d+)/i) ||
    text.match(/protein\s*[:=]?\s*(\d+)/i);
  return match ? parseInt(match[1]) : null;
};

const extractTotalCarbsFromText = (text) => {
  const match =
    text.match(/total\s+carbs\s*[:=]?\s*(\d+)/i) ||
    text.match(/carbs\s*[:=]?\s*(\d+)/i);
  return match ? parseInt(match[1]) : null;
};

const extractTotalFatsFromText = (text) => {
  const match =
    text.match(/total\s+fats?\s*[:=]?\s*(\d+)/i) ||
    text.match(/fats?\s*[:=]?\s*(\d+)/i);
  return match ? parseInt(match[1]) : null;
};

const extractDayFromText = (text) => {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const lowercaseText = text.toLowerCase();

  for (const day of days) {
    if (lowercaseText.includes(day))
      return day.charAt(0).toUpperCase() + day.slice(1);
  }

  return null;
};

const extractFocusFromText = (text) => {
  const focusTypes = [
    "chest",
    "back",
    "legs",
    "arms",
    "shoulders",
    "cardio",
    "core",
    "full body",
  ];
  const lowercaseText = text.toLowerCase();

  for (const focus of focusTypes) {
    if (lowercaseText.includes(focus))
      return focus.charAt(0).toUpperCase() + focus.slice(1);
  }

  return "Full body";
};

const extractExercisesFromText = (text) => {
  if (!text) return [];

  // Handle different formats
  if (Array.isArray(text)) return text; // Already an array

  const exercises = [];
  if (text.includes(",")) {
    exercises = text.split(",").map((e) => e.trim());
  }
  // Try bullet points
  else if (text.includes("•")) {
    exercises = text
      .split("•")
      .filter((e) => e.trim())
      .map((e) => e.trim());
  }
  // Try newlines
  else if (text.includes("\n")) {
    exercises = text
      .split("\n")
      .filter((e) => e.trim())
      .map((e) => e.trim());
  }
  // Try and/or
  else if (text.includes(" and ") || text.includes(" or ")) {
    exercises = text.split(/ and | or /).map((e) => e.trim());
  }
  // Single exercise
  else if (text.trim()) {
    exercises = [text.trim()];
  }

  return exercises.filter((e) => e && !/^[\d\W]+$/.test(e));
};
