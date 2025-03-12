import express from "express";
import { protect } from "../middlewares/authMW.js";
import {
  validateDietPlanPreferences,
  validateWorkoutPlanPreferences,
} from "../middlewares/validationMW.js";

import { saveDietPreferences } from "../Controllers/dietPlanController.js";

import { saveWorkoutPreferences } from "../Controllers/workoutPlanContoller.js";

// Add after protect middleware
const router = express.Router();

// Protected routes (require login)
router.use(protect);

router.post(
  "/diet-preferences",
  validateDietPlanPreferences,
  saveDietPreferences
);
router.post(
  "/workout-preferences",
  validateWorkoutPlanPreferences,
  saveWorkoutPreferences
);
// router.post("/generate-diet", planGenerationLimiter, generateDietPlan);
// router.post("/generate-workout", planGenerationLimiter, generateWorkoutPlan);

export default router;
