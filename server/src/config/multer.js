import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs/promises";

//Config Cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// local storage for temporary files
const storage = multer.diskStorage({
  destination: async (requestAnimationFrame, files, cb) => {
    const uploadDir = "uploads/avatars/";

    // Create dictionary
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `avatar-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

//file validation
const fileFilter = (req, res, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes()) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

//Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
    files: 1,
  },
});

const cloudinaryUpload = async (req, res, next) => {
  try {
    if (!req.files) return next();

    //Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "HealthCare-web/avatars",
      transformation: [
        { width: 200, height: 200, crop: "fill" },
        { quality: "auto:best" },
      ],
    });

    req.cloudinaryUrl = result.secure_url;

    //Cleanup files
    await fs.unlink(req.file.path);
    next();
  } catch (error) {
    console.error("Error uploading to cloudinary:", error.message);
    next(error);
    await fs.unlink(req.file.path).catch(() => {});
    next(error);
  }
};

export { upload, cloudinaryUpload };
