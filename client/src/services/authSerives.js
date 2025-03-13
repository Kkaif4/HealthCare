import axios from "axios";

export const login = async (email, password) => {
  try {
    const { data } = await axios.post("/auth/login", { email, password });
    const token = data.token;
    console.log(data.user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
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
