import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @param {string} modelName - Gemini model version (default: 'gemini-pro')
 * @returns {GenerativeModel} Configured AI model instance
 */
const initializeModel = (modelName = "gemini-pro") => {
  try {
    return genAI.getGenerativeModel({ model: modelName });
  } catch (error) {
    console.error("Failed to initialize Gemini model:", error);
    throw error; // Propagate error for handling
  }
};

export default initializeModel;
