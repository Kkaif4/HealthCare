import { skipMiddlewareFunction } from "mongoose";

export const validateDietPlanPreferences = (req, res, next) => {
  const requiredFields = [
    "dietGoal",
    "dietType",
    "foodAllergies",
    "favoriteFoods",
    "dislikedFoods",
    "budget",
    "targetWeight",
    "timePeriod",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      console.error(`Missing required field: ${field}`);
      return res.status(400).json({
        success: false,
        error: `Missing required field: ${field}`,
      });
    }
  }
  next();
};
export const validateWorkoutPlanPreferences = (req, res, next) => {
  const requiredFields = [
    "workoutGoal",
    "workoutPreferences",
    "workoutDuration",
    "equipment",
    "healthConditions",
    "activityLevel",
    "workoutDaysPerWeek",
    "targetWeight",
    "timePeriod",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      console.log("error in validation middleware");
      console.error(`Missing required field: ${field}`);
      return res.status(400).json({
        success: false,
        error: `Missing required field: ${field}`,
      });
    }
  }
  next();
};
