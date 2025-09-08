export const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(422).json({
      success: false,
      error: "Validation failed",
      details: Object.values(err.errors).map((e) => e.message),
    });
  }
  console.log("error in errorHandler middleware");
  console.error(err.stack);
  console.error(`[${new Date().toISOString()}] ERROR: ${err.message}`);

  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
};
