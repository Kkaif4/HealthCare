import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTPS in production
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Register User
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      weight,
      height,
      medicalHistory,
    } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered try to login");
      return res
        .status(400)
        .json({ success: false, error: "Email already registered" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      age,
      gender,
      weight,
      height,
      medicalHistory,
    });
    console.log("User created successfully");

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie and send response
    res
      .cookie("token", token, cookieOptions)
      .status(201)
      .json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
        },
      });
  } catch (error) {
    console.error("Error registering user:", error.message);
    next(error);
  }
};

//Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("required fields missing");
      return res.status(400).json({ message: "All fields are required" });
    }
    //find user
    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ success: false, error: "User not found" });
    }

    // Check if password exists in the user object
    if (!user.password) {
      return res.status(500).json({
        success: false,
        error: "Server error - Password not found in database",
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid credentials");
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }
    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // Set cookie and send response
    res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
        },
      });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// Logout User
export const logout = (req, res) => {
  console.log("User logged out");
  // Clear cookie and send response
  res
    .clearCookie("token", cookieOptions)
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};
