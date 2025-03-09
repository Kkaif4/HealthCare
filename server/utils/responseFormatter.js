// responseFormatter.js
export const formatPlanResponse = (generatedText) => {
  console.log("----- RAW GEMINI OUTPUT START -----");
  console.log(generatedText);
  console.log("----- RAW GEMINI OUTPUT END -----\n");
  try {
    const isDietPlan = /### DAILY_SCHEDULE/i.test(generatedText);
    const isWorkoutPlan = /### WEEKLY_SCHEDULE/i.test(generatedText);

    if (isDietPlan) {
      return parseDietPlan(generatedText);
    }
    if (isWorkoutPlan) {
      return parseWorkoutPlan(generatedText);
    }
    return fallbackParse(generatedText);
  } catch (error) {
    console.error("Parsing failed:", error.message);
    return fallbackParse(generatedText, error);
  }
};

const parseSchedule = (scheduleText, expectedColumns) => {
  return scheduleText
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("Time |")) // Remove header and empty lines
    .map((line, index) => {
      const columns = line.split("|").map((c) => c.trim());

      // Validate column count
      if (columns.length < expectedColumns) {
        console.warn(
          `Line ${index + 1}: Expected ${expectedColumns} columns, found ${
            columns.length
          }`
        );
      }

      return {
        time: columns[0] || "N/A",
        mealType: columns[1] || "Unknown",
        foodItems: columns[2] || "",
        quantity: columns[3] || "",
        calories: parseNutritionValue(columns[4]),
        protein: parseNutritionValue(columns[5]),
        carbs: parseNutritionValue(columns[6]),
        extras: columns.slice(7), // Capture any extra columns
      };
    });
};

// Diet Plan Parser
const parseDietPlan = (text) => {
  const scheduleSection = getSection(text, "DAILY_SCHEDULE");
  const totalsSection = getSection(text, "TOTALS");
  // Use parseSchedule with expected columns
  const meals = parseSchedule(scheduleSection, 7);
  const totals = parseTotals(totalsSection);
  if (scheduleSection.length < 10 || totalsSection.length < 5) {
    throw new Error("Incomplete sections detected");
  }
  // Add header validation
  const [headerLine] = scheduleSection.split("\n");
  const requiredColumns = [
    "time",
    "meal type",
    "food items",
    "quantity",
    "calories",
    "protein",
    "carbs(g)",
  ];
  const headerColumns = headerLine
    .toLowerCase()
    .split("|")
    .map((c) => c.trim());
  const missingColumns = requiredColumns.filter(
    (rc) => !headerColumns.some((hc) => hc.includes(rc))
  );

  if (missingColumns.length > 0) {
    throw new Error(`Missing columns: ${missingColumns.join(", ")}`);
  }

  if (
    !header.includes(
      "Time | Meal Type | Food Items | Quantity | Calories | Protein(g) | Carbs(g)"
    )
  ) {
    throw new Error("Invalid schedule header format");
  }

  return { type: "diet", schedule: meals, totals };
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
    `^###\\s*${sectionName}.*\\n([\\s\\S]*?)(?=^###|$)`,
    "gmi"
  );

  const match = regex.exec(text);
  if (!match) {
    console.error(`Missing ${sectionName} section in:\n${text.slice(0, 200)}`);
    throw new Error(`Missing ${sectionName} section`);
  }

  return match[1].trim();
};
// Robust totals parser
const parseTotals = (totalsText) => {
  return totalsText.split("\n").reduce((acc, line) => {
    // Handle different delimiters and units
    const [keyPart, ...valueParts] = line
      .split(/[:=]/)
      .map((x) => x.trim().toLowerCase());
    const value = valueParts.join("").replace(/[^\d.]/g, "");

    if (keyPart && value) {
      const cleanKey = keyPart
        .toLowerCase()
        .replace(/(total|daily)/gi, "") // Remove redundant words
        .replace(/[^a-z]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");

      if (cleanKey) {
        acc[cleanKey] = parseFloat(value) || 0;
      }
    }
    return acc;
  }, {});
};

const parseNutritionValue = (value) => {
  // Extract numbers from values like "200 kcal" or "50g"
  const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));
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
