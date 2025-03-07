export const validatePlanPreferences = (req, res, next) => {
  const requiredFields = [
    "goal",
    "activityLevel",
    "workoutDaysPerWeek",
    "dietType",
    "targetWeight",
    "budget",
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
