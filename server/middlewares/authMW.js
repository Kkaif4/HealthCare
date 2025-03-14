import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({
        success: false,
        error: "Not authorized - No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Get user (exclude password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("user not found");
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error authorizing user:", error.message);
    res.status(401).json({
      success: false,
      error: "Not authorized - Invalid token",
    });
  }
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
