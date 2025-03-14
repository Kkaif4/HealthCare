import axios from "axios";
import { getDietPreferences } from "./planServices.js";
export const login = async (email, password) => {
  try {
    const response = await axios.post("/auth/login", {
      email,
      password,
    });
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    const userId = user._id;
    try {
      const preferences = await getDietPreferences(userId);
      localStorage.removeItem("dietPreferences");
      localStorage.setItem("dietPreferences", JSON.stringify(preferences.data));
    } catch (error) {
      console.error("Error fetching preferences:", error.message);
    }
    return user;
  } catch (error) {
    console.error("Error in login:", error.message);
  }
};

export const register = async (formData) => {
  try {
    const { data } = await axios.post("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("dietPreferences");
  localStorage.removeItem("workoutPreferences");
};
