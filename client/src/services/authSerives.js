import axios from "axios";

export const login = async (email, password) => {
  try {
    const { data } = await axios.post("api/auth/login", { email, password });
    localStorage.setItem("user", JSON.stringify(data));
  } catch (error) {
    console.log("error in frontend login auth function");
    console.error(error);
  }
};

export const registerUser = async (formData) => {
  try {
    const { data } = await axios.post("api/auth/register", formData);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (error) {
    console.log("error in frontend register auth function");
    console.error(error);
    throw error;
  }
};
