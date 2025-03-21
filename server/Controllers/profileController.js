// controllers/profileController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import DietPreferences from "../models/DietPreferences.js";
import WorkoutPreference from "../models/WorkoutPreferences.js";
import { v2 as cloudinary } from "cloudinary";

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//1. Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch profile" });
  }
};

//2. Update user profile
export const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ["name", "phone", "address"];
    const updates = {};

    // Filter valid fields
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) updates[key] = req.body[key];
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: "Update failed" });
  }
};

//3. Update prifle picture
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Update user avatar
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: result.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Avatar upload failed" });
  }
};

//4. Change Password
export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    // Verify current password
    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!isMatch) {
      console.log("password didnt match");
      return res
        .status(401)
        .json({ success: false, error: "Invalid current password" });
    }

    // Set new password
    user.password = await bcrypt.hash(req.body.newPassword, 12);
    await user.save();
    console.log("password updated");

    res.status(200).json({ success: true, message: "Password updated" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Password change failed" });
  }
};

//5. Delete account
export const deleteAccount = async (req, res) => {
  console.log("deleteAccount");
  try {
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Account deletion failed" });
  }
};

// 6. Get health metrics
export const getDietMetrics = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ success: false, error: "User not found" });
    }
    const userDiet = await DietPreferences.findOne({ userId: user.id });
    res.status(200).json({ success: true, data: userDiet });
    if (!userDiet) {
      console.log("user diet preferences not found");
      return res
        .status(404)
        .json({ success: false, error: "No diet data found" });
    }
  } catch (error) {
    console.log("Error getting Diet metrics");
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch health data" });
  }
};

export const getDietPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ success: false, error: "User not found" });
    }
    console.log(user._id);
    const userDiet = user.dietPlan;
    if (!userDiet) {
      console.log("User diet plan not found");
      return res
        .status(404)
        .json({ success: false, error: "No diet plan found" });
    }
    res.status(200).json({ success: true, data: userDiet });
  } catch (error) {
    console.log("Error getting Diet Plan");
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch diet plan" });
  }
};

export const getWorkoutMetrics = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userWorkout = await WorkoutPreference.findById(user.id);
    res.status(200).json({ success: true, data: userWorkout });
  } catch (error) {
    console.log("Error getting Workout metrics");
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch health data" });
  }
};

export const getWorkoutPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ success: false, error: "User not found" });
    }
    console.log(user._id);
    const userWorkout = yser.workoutPlan;
    if (!userWorkout) {
      console.log("User workout plan not found");
      return res
        .status(404)
        .json({ success: false, error: "No Workout plan found" });
    }
    res.status(200).json({ success: true, data: userWorkout });
  } catch (error) {
    console.log(error.message);
    console.log("Error getting workout Plan");
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch workout plan" });
  }
};

// 10. Export user data
export const exportUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("dietPlan workoutPlan")
      .select("-password");

    res.setHeader("Content-Type", "application/json");
    res.attachment("user-data.json");
    res.send(JSON.stringify(user, null, 2));
  } catch (error) {
    res.status(500).json({ success: false, error: "Data export failed" });
  }
};
