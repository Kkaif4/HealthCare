import express from 'express';
import { protect } from '../middlewares/authMW.js';
import {
  validateDietPlanPreferences,
  validateWorkoutPlanPreferences,
} from '../middlewares/validationMW.js';

import {
  saveDietPreferences,
  generateDietPlan,
  getDietPlan,
  getDietPreferences,
} from '../Controllers/dietPlanController.js';

import {
  saveWorkoutPreferences,
  generateWorkoutPlan,
  getWorkoutPlan,
  getWorkoutPreferences,
} from '../Controllers/workoutPlanContoller.js';

import { planGenerationLimiter } from '../middlewares/rateLimitMW.js';

// Add after protect middleware
const router = express.Router();

// Protected routes (require login)
router.use(protect);

router.post(
  '/diet-preferences',
  validateDietPlanPreferences,
  saveDietPreferences
);
router.post(
  '/workout-preferences',
  validateWorkoutPlanPreferences,
  saveWorkoutPreferences
);
router.get('/generate-diet', planGenerationLimiter, generateDietPlan);
router.get('/generate-workout', planGenerationLimiter, generateWorkoutPlan);

router.get('/user-diet-preferences/:userId', getDietPreferences);
router.get('/user-workout-preferences/:userId', getWorkoutPreferences);

router.get('/user-diet-plan', getDietPlan);
router.get('/user-workout-plan', getWorkoutPlan);

export default router;
