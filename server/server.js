import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import { errorHandler } from "./middlewares/errorMW.js";
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

//Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);


//Error handlers
app.use(errorHandler);

app.listen(PORT, () => {
  console.dir(`Server running on port ${PORT}`);
});
