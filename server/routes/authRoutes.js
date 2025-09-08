import express from "express";
import { register, login, logout } from "../Controllers/authController.js";
import { upload } from "../config/multer.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
