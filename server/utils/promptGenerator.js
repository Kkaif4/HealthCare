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
  Time | Meal Type | Food Items | Quantity | Calories | Protein(g) | Carbs(g)
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
  return `
  **WORKOUT PLAN**
  Create ${preferences.timePeriod} plan for ${preferences.workoutPreferences} workouts:

  ### WEEKLY_SCHEDULE
  Day | Focus Area | Exercises | Equipment | Sets/Reps | Duration | Intensity
  ${getWeeklyScheduleStructure()}

  ### TOTALS
  Weekly Sessions: ${preferences.workoutDaysPerWeek}
  Daily Time: ${preferences.availableTimePerDay}
  Intensity Level: ${preferences.activityLevel}

  RULES:
  1. Equipment: ${preferences.equipment.join(", ") || "Bodyweight only"}
  2. Medical Constraints: ${preferences.medicalConstraints.join(", ") || "None"}
  3. Primary Goal: ${preferences.workoutGoal.replace("-", " ")}
  4. Use Indian exercise names where possible
  5. Include ${preferences.availableTimePerDay} warmup/cooldown
  6. Use standard units for sets/reps (e.g., 3x12)
  7. Duration in minutes
  8. Time period ${preferences.timePeriod} months
  9. Target weight: ${preferences.targetWeight} kg
  
  
  Personal Context:
  - Age: ${user.age} | Gender: ${user.gender} | Weight: ${user.weight} kg
  SAMPLE ENTRY:
  Monday | Upper Body | Surya Namaskar, Danda | Yoga mat | 5x12 | 45 mins | Medium
  `;
};

const getMealTimingStructure = () => {
  return `Example:
  08:00 | Breakfast | Poha, Almonds | 1 bowl, 5-6 pieces | 250 | 6 | 45
  11:00 | Mid-Morning | Fruit Salad | 1 cup | 100 | 1 | 25`;
};

const getWeeklyScheduleStructure = (days) => {
  return `Example:
  Monday | Strength Training | Push-ups, Dumbbell Rows | 3x12 | 45 mins | Medium
  Tuesday | Yoga | Surya Namaskar, Pranayama | 5 rounds | 30 mins | Low`;
};
