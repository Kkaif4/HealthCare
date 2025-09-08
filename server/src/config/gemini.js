import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @param {string} modelName - Gemini model version (default: 'gemini-pro')
 * @returns {GenerativeModel} Configured AI model instance
 */
const initializeModel = (modelName = 'gemini-2.0-flash') => {
  try {
    return genAI.getGenerativeModel({ model: modelName });
  } catch (error) {
    console.error('Failed to initialize Gemini model:', error);
    throw error;
  }
};

export default initializeModel;
