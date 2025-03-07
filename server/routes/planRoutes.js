import express from "express";
import { protect } from "../middlewares/authMW.js";
import { planGenerationLimiter } from "../middlewares/rateLimitMW.js";
import { validatePlanPreferences } from "../middlewares/validationMW.js";

import {
  savePreferences,
  generateDietPlan,
  generateWorkoutPlan,
} from "../Controllers/planController.js";

// Add after protect middleware
const router = express.Router();

// Protected routes (require login)
router.use(protect);

router.post("/preferences", validatePlanPreferences, savePreferences);
router.post("/generate-diet", planGenerationLimiter, generateDietPlan);
router.post("/generate-workout", planGenerationLimiter, generateWorkoutPlan);

export default router;