import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorMW.js";
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

//Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

//Error handlers
app.use(errorHandler);

app.listen(PORT, () => {
  console.dir(`Server running on port ${PORT}`);
});
