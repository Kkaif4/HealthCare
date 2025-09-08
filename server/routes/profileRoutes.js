// routes/profileRoutes.js
import express from "express";
import { protect, verifyToken } from "../middlewares/authMW.js";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getDietPlan,
  getWorkoutPlan,
  exportUserData,
} from "../Controllers/profileController.js";
import {
  profileLimiter,
  sensitiveLimiter,
} from "../middlewares/rateLimitMW.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Profile Management
router
  .route("/")
  .get(verifyToken, getProfile) // Get profile details
  .put(profileLimiter, updateProfile) // Update profile info
  .delete(deleteAccount); // Delete account

// Password Management
router.put("/password", sensitiveLimiter, changePassword);

//Plans
router.get("/diet-plan", getDietPlan);
router.get("/workout-plan", getWorkoutPlan);

// Data Export
router.get("/export", sensitiveLimiter, profileLimiter, exportUserData);

export default router;
