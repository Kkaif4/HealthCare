import API from "./axios.js";

export const loginUser = async (email, password) => {
  try {
    const response = await API.post("/auth/login", { email, password });
    return response;
  } catch (error) {
    console.log("error in frontend loing auth function");
    console.error(error);
    throw error;
  }
};

export const registerUser = async (formData) => {
  try {
    const response = await API.post("/auth/register", formData);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log("error in frontend register auth function");
    console.error(error);
    throw error;
  }
};
