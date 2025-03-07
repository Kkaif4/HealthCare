import rateLimit from "express-rate-limit";

export const planGenerationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    error: "Too many plan generations. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
