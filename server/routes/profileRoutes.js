// routes/profileRoutes.js
import express from "express";
import { protect } from "../middlewares/authMW.js";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
  deleteAccount,
  getDietPlan,
  getWorkoutPlan,
  exportUserData,
} from "../Controllers/profileController.js";
import { upload, cloudinaryUpload } from "../config/multer.js";
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
  .get(profileLimiter, getProfile) // Get profile details
  .put(profileLimiter, updateProfile) // Update profile info
  .delete(deleteAccount); // Delete account

// Avatar Upload
router.post(
  "/avatar",
  protect,
  upload.single("avatar"),
  cloudinaryUpload,
  uploadAvatar
);

// Password Management
router.put("/password", sensitiveLimiter, changePassword);

//Plans
router.get("/diet-plan", getDietPlan);
router.get("/workout-plan", getWorkoutPlan);

// Data Export
router.get("/export", sensitiveLimiter, profileLimiter, exportUserData);

export default router;
