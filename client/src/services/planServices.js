import axios from "axios";

/**
 * Save diet preferences to the database
 * @param {Object} dietPreferences - User's diet preferences data
 * @returns {Promise} - API response
 */
export const saveDietPreferences = async (dietPreferences) => {
  try {
    const response = await axios.post(
      `/plans/diet-preferences`,
      dietPreferences
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to save diet preferences" }
    );
  }
};

/**
 * Generate a diet plan based on user preferences
 * @param {Object} userData - User data required for diet plan generation
 * @returns {Promise} - API response with generated diet plan
 */
export const generateDietPlan = async (userData) => {
  try {
    const response = await axios.post(`/plans/generate-diet`, userData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to generate diet plan" };
  }
};

/**
 * Save workout preferences to the database
 * @param {Object} workoutPreferences - User's workout preferences data
 * @returns {Promise} - API response
 */
export const saveWorkoutPreferences = async (workoutPreferences) => {
  try {
    const response = await axios.post(
      `/plans/workout-preferences`,
      workoutPreferences,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to save workout preferences" }
    );
  }
};

/**
 * Generate a workout plan based on user preferences
 * @param {Object} userData - User data required for workout plan generation
 * @returns {Promise} - API response with generated workout plan
 */
export const generateWorkoutPlan = async (userData) => {
  try {
    const response = await axios.post(`/plans/generate-workout`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to generate workout plan" }
    );
  }
};

/**
 * Get a user's diet plan
 * @param {string} userId - User ID
 * @returns {Promise} - API response with user's diet plan
 */
export const getDietPlan = async (user) => {
  try {
    const response = await axios.get(`/plans/diet/${user}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch diet plan" };
  }
};

/**
 * Get a user's workout plan
 * @param {string} userId - User ID
 * @returns {Promise} - API response with user's workout plan
 */
export const getUserWorkoutPlan = async (userId) => {
  try {
    const response = await axios.get(`/plans/workout/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch workout plan" };
  }
};
