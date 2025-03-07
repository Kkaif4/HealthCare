import Symptom from "../models/Symptom.js";
import { formatPlanResponse } from "../utils/responseFormatter.js";
import { generateDiagnosePrompt } from "../utils/promptGenerator.js";
export const analyzeSymptoms = async (req, res, next) => {
  try {
    const { symptoms, durationDays } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!symptoms?.length || !durationDays) {
      console.error("Symptoms and duration are required");
      return res.status(400).json({
        success: false,
        error: "Symptoms and duration are required",
      });
    }

    // Generate analysis
    const prompt = generateDiagnosePrompt(symptoms, durationDays);
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();
    const formattedContent = formatPlanResponse(analysis);

    // Save analysis
    const symptomRecord = await Symptom.create({
      userId,
      symptoms,
      durationDays,
      aiAnalysis: formattedContent,
    });

    res.status(201).json({
      success: true,
      data: symptomRecord,
    });
  } catch (error) {
    console.error("Disease analysis error:", error.message);
    next(error);
  }
};
