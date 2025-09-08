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

export const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    error: "Too many profile requests. Please try again later.",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit by user ID instead of IP
    return req.user ? req.user.id : req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "Too many profile requests. Please try again later.",
    });
  },
});

// Stricter limiter for sensitive operations
export const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour
  message: {
    success: false,
    error: "Too many sensitive operations. Try again later.",
  },
});
