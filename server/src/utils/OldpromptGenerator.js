// calculate BMI function
export const calculateBMI = (weight, height) => {
  const heightM = height / 100;
  return (weight / (heightM * heightM)).toFixed(1);
};

// Helper function for BMI classification
export const getBMIClassification = (bmi) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 24.9) return "Normal";
  if (bmi < 29.9) return "Overweight";
  return "Obese";
};

// Generate DietPrompt
export const generateDietPrompt = (user, preferences) => {
  // Validate required fields
  if (!preferences.targetWeight || !preferences.timePeriod) {
    throw new Error("Missing required fields for diet prompt generation");
  }

  return `
  **INDIAN DIET PLAN GENERATION**
  
  ### DAILY_SCHEDULE
  Time | Meal Type | Food Items | Quantity | Calories | Protein | Carbs
  ${getMealTimingStructure()}
  Generate a ${preferences.timePeriod} meal plan following STRICT FORMAT:
  
  ### TOTALS
  Daily Calories: X kcal
  Total Protein: X g
  Total Carbs: X g
  Total Fats: X g

  Responce Format RULES:
  1. Use ONLY pipe (|) separators between columns
  2. Follow Indian dietary traditions strictly
  4. Quantity in standard units (e.g., 1 bowl, 2 roti)
  5. Macronutrient values must be numeric only
  6. Never use markdown or additional headers
  7. Use EXACT header names and order shown above
  8. Maintain column count (7 columns)
  9. No additional formatting in headers
  
  Diet Plan RULES:
  1. 
  2. 
  3. 

  Personal Context:
  - Age: ${user.age} | Gender: ${user.gender} | Weight: ${user.weight} kg
  - Target: ${preferences.dietGoal} kg in ${preferences.timePeriod} months
  - Diet Type: ${preferences.dietType}
  - Prioritize: ${preferences.favoriteFoods.join(", ") || "No preferences"}
  - Avoid: ${preferences.dislikedFoods.join(", ") || "Nothing"}
  - Allergies: ${preferences.foodAllergies.join(", ") || "None"}
  - Cultural Restrictions: ${preferences.dietaryRestrictions.join(", ")}
  - Budget: ${preferences.budget}
  `;
};

// Generate WorkoutPrompt
export const generateWorkoutPrompt = (user, preferences) => {
  const workoutDaysStructure = getWorkoutDaysStructure(preferences.daysPerWeek);
  return `
  **INDIAN WORKOUT PLAN GENERATION**
  
  ### WORKOUT_SCHEDULE
  Day | Workout Type | Exercises | Sets | Reps | Duration | Rest
  ${workoutDaysStructure}
  Generate a ${
    preferences.daysPerWeek
  }-day per week structured workout plan following STRICT FORMAT:

  ### TOTALS
  Weekly Workout Duration: X minutes
  Total Sessions: X
  Focus Areas: X

  **Response Format RULES:**
  1. Use ONLY pipe (|) separators between columns
  2. Follow scientifically structured workout principles
  3. Use appropriate sets, reps, and rest periods
  4. Duration should be in minutes (e.g., 45 min)
  5. Maintain column count (7 columns)
  6. No additional formatting in headers
  7. Use EXACT header names and order shown above

  **Workout Plan RULES:**
  1. Must be tailored for ${preferences.workoutGoal}  
  2. Should include progressive overload  
  3. Consider ${
    preferences.equipment ? "available equipment" : "bodyweight exercises"
  }  

  **Personal Context:**
  - Age: ${user.age} | Gender: ${user.gender} | Weight: ${user.weight} kg
  - Fitness Goal: ${preferences.workoutGoal}
  - Experience Level: ${preferences.experienceLevel}
  - Preferred Workout Type: ${
    preferences.preferredWorkoutType || "No preference"
  }
  - Equipment Available: ${preferences.equipment || "None"}
  - Days per Week: ${preferences.daysPerWeek}
  - Time per Session: ${preferences.workoutDuration} minutes
  ${getWeeklyScheduleStructure()}
  `;
};

/**
 * Generates a structure for workout days based on number of days per week
 * @param {Number} daysPerWeek - Number of workout days per week
 * @returns {String} - Template structure
 */
const getWorkoutDaysStructure = (daysPerWeek) => {
  let structure = "";

  if (daysPerWeek <= 3) {
    // Full body focus for fewer days
    for (let i = 1; i <= daysPerWeek; i++) {
      structure += `Day ${i} (Full Body) | | | |\n`;
    }
  } else if (daysPerWeek <= 5) {
    // Upper/Lower or Push/Pull/Legs split
    const splits = [
      "Upper Body",
      "Lower Body",
      "Upper Body",
      "Lower Body",
      "Full Body",
    ];
    for (let i = 0; i < daysPerWeek; i++) {
      structure += `Day ${i + 1} (${splits[i]}) | | | |\n`;
    }
  } else {
    // Body part split for 6-7 days
    const splits = [
      "Chest",
      "Back",
      "Legs",
      "Shoulders",
      "Arms",
      "Core/Cardio",
      "Active Recovery",
    ];
    for (let i = 0; i < daysPerWeek; i++) {
      structure += `Day ${i + 1} (${splits[i]}) | | | |\n`;
    }
  }

  return structure;
};

const getMealTimingStructure = () => {
  return `Example:
  08:00 | Breakfast | Poha, Almonds | 1 bowl, 5-6 pieces | 250 | 6 | 45
  11:00 | Mid-Morning | Fruit Salad | 1 cup | 100 | 1 | 25`;
};

const getWeeklyScheduleStructure = (days) => {
  return `
  **Example Weekly Schedule:**
  
  | Monday   | Strength Training | Push-ups, Dumbbell Rows     | 3x12       | 45 mins  | Medium    |
  | Tuesday  | Yoga              | Surya Namaskar, Pranayama   | 5 rounds   | 30 mins  | Low       |
  
  *This structure should be followed while planning a ${days}-day workout schedule.*  
  `;
};
