import axios from "axios";
import { getMe } from "./authSerives.js";
/**
 * Save diet preferences to the database
 * @param {Object} dietPreferences - User's diet preferences data
 * @returns {Promise} - API response
 */
export const saveDietPreferences = async (formData) => {
  try {
    // Get token for authentication
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    //Save diet preferences to the database
    const response = await axios.post(`/plans/diet-preferences`, formData, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    try {
      // Get Current user from localStorage and parse it properly
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        throw new Error("User not found in localStorage");
      }

      const user = JSON.parse(userStr);
      const userId = user._id;

      if (!userId) {
        throw new Error("User ID not found");
      }
      // Get diet preferences
      const dietPreferenceResponse = await getDietPreferences(userId);

      // Generate diet plan
      await generateDietPlan(user);
      //getting Profile
      try {
        await getMe(user);
      } catch (err) {
        console.log("Error getting Profile:", err.message);
      }
      const updatedUserResponse = await axios.get(`/profile`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (updatedUserResponse && updatedUserResponse.data) {
        console.log(updatedUserResponse.data);
        localStorage.setItem("user", JSON.stringify(updatedUserResponse.data));
      }

      if (dietPreferenceResponse && dietPreferenceResponse.data) {
        localStorage.setItem(
          "dietPreferences",
          JSON.stringify(dietPreferenceResponse.data)
        );
      }
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
    // Get token for authentication
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Save workout preferences to the database
    const response = await axios.post(`/plans/workout-preferences`, formData, {
      withCredentials: true,
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    try {
      // Get user from localStorage and parse it properly
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        throw new Error("User not found in localStorage");
      }
      const user = JSON.parse(userStr);
      const userId = user._id;

      if (!userId) {
        throw new Error("User ID not found");
      }
      // Get updated workout preferences
      const workoutPreferenceResponse = await getDietPreferences(userId);
      // Generate workout plan
      await generateWorkoutPlan(user);

      //getting Profile
      try {
        const response = await getMe(user);
        if (response && response.data) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      } catch (err) {
        console.error("Error getting profile", err.message);
      }
      // Update localStorage with new data
      const updatedUserResponse = await axios.get(`/profile`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (updatedUserResponse && updatedUserResponse.data) {
        localStorage.setItem("user", JSON.stringify(updatedUserResponse.data));
      }

      if (workoutPreferenceResponse && workoutPreferenceResponse.data) {
        localStorage.setItem(
          "workoutPreferences",
          JSON.stringify(workoutPreferenceResponse.data)
        );
      }
    } catch (error) {
      console.log("Error fetching preferences:", error.message);
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
    const response = await axios.get(`/plans/user-diet-preferences/${userId}`);
    return response;
  } catch (error) {
    console.error("Error fetching diet preferences:", error.message);
    return null;
  }
};
export const getWorkoutPreferences = async (userId) => {
  if (!userId) {
    console.error("No userId provided to getWorkoutPreferences");
    return null;
  }
  try {
    const response = await axios.get(
      `/plans/user-workout-preferences/${userId}`
    );
    return response; // Return the whole response object
  } catch (error) {
    console.error("Error fetching workout preferences:", error.message);
    return null;
  }
};
