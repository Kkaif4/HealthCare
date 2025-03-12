import axios from "axios";

export const login = async (email, password) => {
  try {
    const { data } = await axios.post("/api/auth/login", { email, password });
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error in login:", error.message);
  }
};

export const register = async (formData) => {
  try {
    const { data } = axios.post("/api/auth/register", formData);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error in register:", error.message);
  }
};
