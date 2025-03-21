import axios from "axios";
import { getDietPreferences, getWorkoutPreferences } from "./planServices.js";
export const login = async (email, password) => {
  try {
    const response = await axios.post("/auth/login", {
      email,
      password,
    });
    const { token, user } = response.data;

    // Store the token and user data in local storage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    const userId = user._id;
    //Check if the userId exists
    if (!userId) {
      console.log("Couldn't find the userId");
      return user;
    }
    //Get Diet Preferences
    try {
      const dietPreferencesResponse = await getDietPreferences(userId);
      if (dietPreferencesResponse && dietPreferencesResponse.data) {
        localStorage.setItem(
          "dietPreferences",
          JSON.stringify(dietPreferencesResponse.data)
        );
      }
    } catch (error) {
      console.log("Error fetching preferences:", error.message);
    }
    // Get workout preferences
    try {
      const workoutPreferencesResponse = await getWorkoutPreferences(userId);
      if (workoutPreferencesResponse && workoutPreferencesResponse.data) {
        localStorage.setItem(
          "workoutPreferences",
          JSON.stringify(workoutPreferencesResponse.data)
        );
      }
    } catch (error) {
      console.error("Error fetching preferences:", error.message);
    }
    return user;
  } catch (error) {
    console.error("Error in login:", error.message);
    throw error;
  }
};

export const register = async (formData) => {
  try {
    const { data } = await axios.post("/auth/register", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Registration error details:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Registration request failed"
    );
  }
};

export const getMe = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = response.data.data;
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    throw error;
  }
};
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("dietPreferences");
  localStorage.removeItem("workoutPreferences");
};

export const deleteAccount = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete("/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("dietPreferences");
    localStorage.removeItem("workoutPreferences");
    return response.data.message;
  } catch (error) {
    console.error("Error deleting account:", error.message);
    throw error;
  }
};
