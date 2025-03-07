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

  const bmi = calculateBMI(user.weight, user.height);
  const bmiClass = getBMIClassification(bmi);

  return `
      **INDIAN DIET PLAN GENERATION**
      please note that the plan should strictly follow the indian tredision while generating the plan.
      Personal Details:
      - Age: ${user.age}
      - Gender: ${user.gender}
      - Height: ${user.height} cm
      - Current Weight: ${user.weight} kg
      - BMI: ${bmi} (${bmiClass})
      
      Health Goals:
      - Target Weight: ${preferences.targetWeight} kg
      - Time Frame: ${preferences.timePeriod}
      - Primary Goal: ${preferences.goal}
      
      Dietary Preferences:
      - Diet Type: ${preferences.dietType}
      - Food Allergies: ${preferences.foodAllergies.join(", ") || "None"}
      - Cultural Restrictions: ${preferences.religiousRestrictions || "None"}
      - Preferred Foods: ${preferences.favoriteFoods.join(", ") || "None"}
      - Disliked Foods: ${preferences.dislikedFoods.join(", ") || "None"}
      
      Health Considerations:
      - Medical Conditions: ${user.medicalHistory.join(", ") || "None"}
      - Budget: ${preferences.budget}
      
      Requirements:
      1. Calculate BMR and TDEE based on provided metrics
      2. Create a ${preferences.timePeriod} meal plan with Indian foods
      3. Include macronutrient breakdown for each meal
      4. Suggest meal timing and portion sizes
      5. Provide budget-friendly ingredient alternatives
      
      Format:
      - Day-wise meal structure
      - Weekly shopping list
      - Calorie tracking guidelines
    `;
};

// Generate WorkoutPrompt
export const generateWorkoutPrompt = (user, preferences) => {
  // Validate required fields
  if (!preferences.availableTimePerDay || !preferences.workoutDaysPerWeek) {
    throw new Error("Missing required fields for workout prompt generation");
  }

  const bmi = calculateBMI(user.weight, user.height);
  const bmiClass = getBMIClassification(bmi);

  return `
      **INDIAN WORKOUT PLAN GENERATION**
      
      Personal Details:
      - Age: ${user.age}
      - Gender: ${user.gender}
      - Weight: ${user.weight} kg
      - Height: ${user.height} cm
      - BMI: ${bmi} (${bmiClass})
      
      Fitness Profile:
      - Primary Goal: ${preferences.goal}
      - Experience Level: ${preferences.activityLevel}
      - Available Days/Week: ${preferences.workoutDaysPerWeek}
      - Daily Time Availability: ${preferences.availableTimePerDay}
      
      Equipment & Constraints:
      - Available Equipment: ${preferences.equipment.join(", ") || "None"}
      - Medical Constraints: ${
        preferences.medicalConstraints.join(", ") || "None"
      }
      
      Preferences:
      - Workout Type: ${preferences.workoutPreferences}
      - Preferred Intensity: ${preferences.activityLevel}
      
      Requirements:
      1. Create a ${preferences.timePeriod} progressive plan
      2. Include warm-up and cool-down routines
      3. Balance strength training and cardio
      4. Provide exercise alternatives for constraints
      5. Include rest day recommendations
      
      Format:
      - Weekly workout schedule
      - Exercise demonstrations (sets/reps/rest)
      - Progression roadmap
      - Safety precautions
    `;
};

//Generate Dieases Prompt
export const generateDiagnosePrompt = (symptoms, duration) => {
  return `
    Act as a medical expert. Analyze these symptoms:
    - Symptoms: ${symptoms.join(', ')}
    - Duration: ${duration} days
    
    Provide:
    1. Possible conditions (list top 3 with probabilities)
    2. Recommended medical tests
    3. Immediate self-care advice
    4. Specialist referral suggestions
    5. Red flags requiring urgent care
    
    Format response in Markdown with clear section headers
  `;
}