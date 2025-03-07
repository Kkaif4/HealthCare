export const errorHandler = (err, req, res, next) => {
  console.log("error in errorHandler middleware");
  console.error(err.stack);

  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "development" ? err.message : "Server error",
  });
};
