import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import { errorHandler } from "./middlewares/errorMW.js";
const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
connectDB();

//Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Handle wrong API requests
app.use((req, res) => {
  if (req.accepts("html")) {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
  } else {
    res
      .status(404)
      .json({ success: false, message: "API not found or wrong API request" });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/profile", profileRoutes);

//Error handlers
app.use(errorHandler);

app.listen(PORT, () => {
  console.dir(`Server running on port ${PORT}`);
});
