/**
 * Construct a prompt for the Gemini API to generate a diet plan
 * @param {Object} user - User object
 * @param {Object} preferences - Diet preferences object
 * @returns {string} - The constructed prompt
 */

export const constructDietPlanPrompt = (user, preferences) => {
  return `
  Create a personalized Indian diet plan based on the following details:
  rule: create in json format, no additional formatting, do not include user details.
  details.
  **User Information:**  
  - Name: ${user.name}  
  - Age: ${user.age}  
  - Gender: ${user.gender}  
  - Height: ${user.height} cm  
  - Weight: ${user.weight} kg  
  - Target Weight: ${preferences.targetWeight} kg  
  - Time Period: ${preferences.timePeriod}  

  **Dietary Goals & Preferences:**  
  - Goal: ${preferences.dietGoal}  
  - Diet Type: ${preferences.dietType}  
  - Budget: ${preferences.budget}  
  - Allergies: ${preferences.foodAllergies.length ? preferences.foodAllergies.join(", ") : "None"}  
  - Favorite Foods: ${preferences.favoriteFoods.length ? preferences.favoriteFoods.join(", ") : "None specified"}  
  - Disliked Foods: ${preferences.dislikedFoods.length ? preferences.dislikedFoods.join(", ") : "None specified"}  
  - Dietary Restrictions: ${preferences.dietaryRestrictions.length ? preferences.dietaryRestrictions.join(", ") : "None"}  

  **Requirements for the Diet Plan:**  
  1. A structured meal plan for ${preferences.timePeriod} that includes breakfast, lunch, dinner, and snacks.  
  2. Detailed portion sizes and approximate calorie counts for each meal.  
  3. A weekly grocery shopping list with key ingredients.  
  4. Meal prep tips to simplify cooking and save time.  
  5. Adjustments based on budget and dietary restrictions.  
  6. Healthy alternatives for disliked foods.  

  The diet plan should be **realistic, easy to follow, and optimized for long-term health benefits** while staying within the user’s preferences and budget.  

  important note: Follow scientifically structured diet principles, Generate a fully formatted HTML response for a personalized Indian diet plan based on the following details. The HTML should be well-structured, include proper headings, lists, and styling, and be directly usable on a website without additional modifications.
  `;
};


export const constructWorkoutPlanPrompt = (preferences) => {
  const heightUnit = "cm";
  const weightUnit = "kg";

  return `
  Create a personalized workout plan for the following individual:
  
  Name: ${user.name}
  Age: ${user.age}
  Gender: ${user.gender}
  Height: ${user.height} ${heightUnit}
  Weight: ${user.weight} ${weightUnit}
  Activity Level: ${activityLevel}
  Health Conditions: ${healthConditions.join(", ") || "None reported"}
  
  Workout Preferences:
  - Fitness Goals: ${fitnessGoals.join(", ") || "Not specified"}
  - Workout Frequency: ${workoutFrequency} days per week
  - Workout Duration: ${workoutDuration} minutes per session
  - Preferred Exercise Types: ${
    preferredExerciseTypes.join(", ") || "No specific preferences"
  }
  - Available Equipment: ${availableEquipment.join(", ") || "None specified"}
  - Workout Location: ${workoutLocation || "Not specified"}
  - Fitness Level: ${fitnessLevel}
  - Injury History: ${injuryHistory.join(", ") || "None reported"}
  - Additional Requirements: ${additionalRequirements || "None specified"}
  
  Please create a detailed workout plan that includes:
  1. An overview of the workout approach and why it's suitable for this person
  2. A full weekly schedule with specific workouts for each day
  3. Detailed exercise descriptions, including sets, reps, and rest periods
  4. Warm-up and cool-down routines
  5. Progression plan for increasing intensity over time
  6. Modifications for different fitness levels or injury accommodations
  7. Tips for proper form and technique
  8. Recovery recommendations
  
  The plan should be practical, achievable, and focused on helping the person reach their fitness goals while respecting their preferences, limitations, and available resources.

  Important note: important note: Follow scientifically structured workout principles, Generate a fully formatted HTML response for a personalized workout plan based on the following details. The HTML should be well-structured, include proper headings, lists, and styling, and be directly usable on a website without additional modifications.
  `;
};
