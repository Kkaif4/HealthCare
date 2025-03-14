/**
 * Construct a prompt for the Gemini API to generate a diet plan
 * @param {Object} user - User object
 * @param {Object} preferences - Diet preferences object
 * @returns {string} - The constructed prompt
 */

export const constructDietPlanPrompt = (user, preferences) => {
  return `
Create a personalized Indian diet plan based on the following details:
User Information:
- Name: ${user.name}
- Age: ${user.age}
- Gender: ${user.gender}
- Height: ${user.height} cm
- Weight: ${user.weight} kg
- Target Weight: ${preferences.targetWeight} kg
- Time Period: ${preferences.timePeriod}

Dietary Goals & Preferences:
- Goal: ${preferences.dietGoal}
- Diet Type: ${preferences.dietType}
- Budget: ${preferences.budget}
- Allergies: ${
    preferences.foodAllergies.length
      ? preferences.foodAllergies.join(", ")
      : "None"
  }
- Favorite Foods: ${
    preferences.favoriteFoods.length
      ? preferences.favoriteFoods.join(", ")
      : "None specified"
  }
- Disliked Foods: ${
    preferences.dislikedFoods.length
      ? preferences.dislikedFoods.join(", ")
      : "None specified"
  }
- Dietary Restrictions: ${
    preferences.dietaryRestrictions.length
      ? preferences.dietaryRestrictions.join(", ")
      : "None"
  }

Requirements for the Diet Plan:
1. A structured weekly meal plan for ${
    preferences.timePeriod
  } with Indian foods, including breakfast, lunch, dinner, and snacks.
2. Detailed portion sizes and approximate calorie counts for each meal.
3. Include macronutrient breakdown (carbohydrates, proteins, fats) for each meal.
4. Suggest meal timings and portion sizes optimized for the user’s goals.
5. A weekly grocery shopping list with key ingredients.
6. Meal prep tips to simplify cooking and save time.
7. Adjustments based on budget and dietary restrictions.
8. Healthy alternatives for disliked foods.
9. Suggest calorie tracking guidelines for better progress monitoring.

The diet plan should be realistic, easy to follow, and optimized for long-term health benefits while staying within the user’s preferences and budget.

Rule: Return the diet plan in simple text with no additional formatting, symbols, json, or html. Do not include user details in the response.
Example output format:
Day 1:
Breakfast: [details]
Lunch: [details]
Dinner: [details]
Snacks: [details]
Day 2:
...and so on.
Grocery list:
...
Meal prep tips:
...
generate a response which in html file but without head tag and body just text of the body with tags and proper formatting
`;
};

export const constructWorkoutPlanPrompt = (preferences, user) => {
  const heightUnit = "cm";
  const weightUnit = "kg";

  return `
    Create a personalized workout plan for the following individual:

    Name: ${user?.name || "Not specified"}
    Age: ${user?.age || "Not specified"}
    Gender: ${user?.gender || "Not specified"}
    Height: ${user?.height || "Not specified"} ${heightUnit}
    Weight: ${user?.weight || "Not specified"} ${weightUnit}
    Activity Level: ${preferences?.activityLevel || "Not specified"}
    Health Conditions: ${
      preferences?.healthConditions?.join(", ") || "None reported"
    }

    Workout Preferences:
    - Workout Goal: ${preferences?.workoutGoal || "Not specified"}
    - Workout Location: ${preferences?.workoutLocation || "Not specified"}
    - Target Weight: ${
      preferences?.targetWeight || "Not specified"
    } ${weightUnit}
    - Time Period: ${preferences?.timePeriod || "Not specified"}
    - Available Time Per Day: ${preferences?.workoutDuration || "Not specified"}
    - Equipment: ${preferences?.equipment?.join(", ") || "None specified"}
    - Workout Duration: ${
      preferences?.workoutDuration || "Not specified"
    } minutes per session
    - Injury History: ${
      preferences?.injuryHistory?.join(", ") || "None reported"
    }
    - Workout Days Per Week: ${
      preferences?.workoutDaysPerWeek || "Not specified"
    } days per week

    Please create a detailed workout plan that includes:
    1. An overview of the workout approach.
    2. A full weekly schedule with specific workouts for each day.
    3. Detailed exercise descriptions, including sets, reps, and rest periods.
    4. Warm-up and cool-down routines.
    5. Progression plan for increasing intensity over time.
    6. Modifications for different fitness levels or injury accommodations.
    7. Tips for proper form and technique.
    8. Recovery recommendations.

    The plan should be practical and focused on helping the person reach their fitness goals.

    Rule: Return the workout plan in simple text with no additional formatting, symbols, json, or html.

    Example output format:
    Workout Overview: [overview]
    Weekly Schedule:
    Day 1: [workout details]
    Day 2: [workout details]
    ...and so on.
    Exercise Descriptions:
    [exercise details]
    Warm-up: [warm-up details]
    Cool-down: [cool-down details]
    Progression Plan: [progression details]
    Modifications: [modification details]
    Form Tips: [form tips]
    Recovery: [recovery details]
    
    generate a response which in html file but without head tag and body just text of the body with tags and proper formatting
  `;
};
