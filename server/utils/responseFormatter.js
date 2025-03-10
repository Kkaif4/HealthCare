// responseFormatter.js
export const formatPlanResponse = (generatedText) => {
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

const parseSchedule = (scheduleText, expectedColumns) => {
  if (typeof scheduleText !== "string" || !scheduleText.trim()) {
    console.error("Invalid schedule text it should be a string");
    throw new Error("Invalid schedule text it should be a string");
  }
  return scheduleText
    .split("\n")
    .filter((line) => line.trim())
    .map((line, index) => {
      const columns = line.split("|").map((c) => c.trim());

      // column count
      if (columns.length < expectedColumns) {
        console.warn(
          `Line ${index + 1}: Expected ${expectedColumns} columns, found ${
            columns.length
          }`
        );
      }
      return {
        time: columns[0]?.trim() || "N/A",
        mealType: columns[1]?.trim() || "Unknown",
        foodItems: columns[2]?.trim() || "",
        quantity: columns[3]?.trim() || "",
        calories: parseNutritionValue(columns[4]),
        protein: parseNutritionValue(columns[5]),
        carbs: parseNutritionValue(columns[6]),
        extras: columns.slice(7),
      };
    })
    .filter((meal) => meal.time !== "N/A");
};

// Diet Plan Parser
const parseDietPlan = (text) => {
  const scheduleSection = getSection(text, "DAILY_SCHEDULE");
  const totalsSection = getSection(text, "TOTALS");
  console.log("Schedule section:", scheduleSection);
  const line = scheduleSection.split("\n").filter((line) => line.trim());
  if (line.length === 0) {
    throw new Error("Empty schedule section");
  }
  const requiredColumns = [
    "time",
    "meal type",
    "food items",
    "quantity",
    "calories",
    "protein",
    "carbs(g)",
  ];

  // Use parseSchedule with expected columns
  if (scheduleSection.length < 10 || totalsSection.length < 5) {
    throw new Error("Incomplete sections detected");
  }
  const [headerLine, ...mealLine] = line;
  if (!/(time)\s*\|.*(meal type)/i.test(headerLine)) {
    throw new Error("Invalid header format: " + headerLine);
  }
  // Basic header validation
  if (
    !headerLine.toLowerCase().includes("time") ||
    !headerLine.toLowerCase().includes("meal")
  ) {
    throw new Error(`Invalid header: ${headerLine}`);
  }
  console.log("Raw meal lines:", mealLine);
  const headerColumns = headerLine
    .toLowerCase()
    .split("|")
    .map((c) => c.trim());
  // Check for missing columns in header
  const missingColumns = requiredColumns.filter(
    (keyword) => !headerColumns.some((hc) => hc.includes(keyword))
  );

  if (missingColumns.length > 0) {
    throw new Error(
      `Missing columns: ${missingColumns.join(", ")} in header: ${headerLine}`
    );
  }
  const meals = parseSchedule(mealLine, 7).filter(
    (meal) => meal.time !== "Meal 1"
  );
  console.log("Parsed meals:", meals);
  if (meals.length === 0) {
    console.error("Empty schedule parsed from:", scheduleSection);
    throw new Error("No valid meals found in schedule");
  }
  console.log("Parsed meals before filter:", meals);
  const totals = parseTotals(totalsSection);
  const finalTotals = {
    calories: totals.calories || sumValues(meals, "calories"),
    protein: totals.protein || sumValues(meals, "protein"),
    carbs: totals.carbs || sumValues(meals, "carbs"),
    ...totals,
  };

  return { type: "diet", schedule: meals, totals: finalTotals };
};

// Workout Plan Parser
const parseWorkoutPlan = (text) => {
  const scheduleSection = getSection(text, "WEEKLY_SCHEDULE");
  const totalsSection = getSection(text, "TOTALS");
  const workouts = parseSchedule(scheduleSection, 5);
  const totals = parseTotals(totalsSection);
  return { type: "workout", schedule: workouts, totals };
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
  const totals = totalsText.split("\n").reduce((acc, line) => {
    // Handle different delimiters and units
    const [key, value] = line.split(/[:=]/).map((x) => x.trim().toLowerCase());

    if (key && value) {
      const cleanKey = key
        .toLowerCase()
        .replace(/(total|daily)/gi, "")
        .replace(/[^a-z]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");

      acc[cleanKey] = parseNutritionValue(value);
    }
    return acc;
  }, {});
  return {
    calories: totals.calories || 0,
    protein: totals.protein || 0,
    carbs: totals.carbs || 0,
  };
};

//helper function
const sumValues = (meals, field) => {
  return meals.reduce((sum, meal) => sum + (meal[field] || 0), 0);
};

const parseNutritionValue = (value) => {
  // Extract numbers from values like "200 kcal" or "50g"
  const numericValue = parseFloat(value.replace(/[^\d.]/g, "") || 0);
  return isNaN(numericValue) ? 0 : numericValue;
};

// Fallback parser (add this at the bottom)
const fallbackParse = (text, error = null) => {
  const entries = text.split("\n").filter((line) => line.includes("|"));

  // Attempt to extract totals from any text
  const totals = {};
  text.split("\n").forEach((line) => {
    if (line.toLowerCase().includes("calories")) {
      totals.calories = parseNutritionValue(line);
    }
    if (line.toLowerCase().includes("protein")) {
      totals.protein = parseNutritionValue(line);
    }
  });

  return {
    type: "diet",
    schedule: entries.map((line) => {
      const parts = line.split("|").map((x) => x.trim());
      return {
        time: parts[0] || "N/A",
        mealType: parts[1] || "Unknown",
        foodItems: parts[2] || "",
        quantity: parts[3] || "",
        calories: parseNutritionValue(parts[4]),
        protein: parseNutritionValue(parts[5]),
        carbs: parseNutritionValue(parts[6]),
      };
    }),
    totals,
    error: error?.message,
    raw: text,
  };
};
