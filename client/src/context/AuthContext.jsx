import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Session Validation Function
  const validateSession = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found in local storage");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      if (!response.data) throw new Error("Invalid user data");
      setUser(response.data);
      return true;
    } catch (error) {
      console.error("Session validation failed:", error.message);
      localStorage.removeItem("token");
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Initialize Auth on Component Mount
  useEffect(() => {
    validateSession();
  }, [validateSession]);

  // ✅ Login Function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/login", { email, password });

      if (!response.data?.token) {
        throw new Error("Authentication token missing in response");
      }

      localStorage.setItem("token", response.data.token);
      await validateSession();
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error.message);
      throw new Error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Signup Function
  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/signup", userData);

      if (!response.data?.token) {
        throw new Error("Registration token missing in response");
      }

      localStorage.setItem("token", response.data.token);
      await validateSession();
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error.message);
      throw new Error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
