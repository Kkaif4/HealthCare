import axios from "axios";

/**
 * Save diet preferences to the database
 * @param {Object} dietPreferences - User's diet preferences data
 * @returns {Promise} - API response
 */
export const saveDietPreferences = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`/plans/diet-preferences`, formData, {
      withCredentials: true,
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    try {
      const user = localStorage.getItem("user");
      await generateDietPlan(user);
      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.log("Error generating diet plan:", error.message);
    }
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
export const saveWorkoutPreferences = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`/plans/workout-preferences`, formData, {
      withCredentials: true,
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    console.log(response);

    try {
      const user = localStorage.getItem("user");
      await generateWorkoutPlan(user);
      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.log("Error generating workout plan:", error.message);
    }
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
const generateWorkoutPlan = async (userData) => {
  try {
    const response = await axios.post(`/plans/generate-workout`, userData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
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
    const response = await axios.get(`/plans/user-diet-plan`, user);
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
export const getWorkoutPlan = async (userId) => {
  try {
    const response = await axios.get(`/plans/workout/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch workout plan" };
  }
};

export const getDietPreferences = async (userId) => {
  try {
    const res = await axios.get(`/plans/user-diet-preferences/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching diet preferences:", error.message);
    return null;
  }
};
