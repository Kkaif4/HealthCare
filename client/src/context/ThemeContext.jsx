/* eslint-disable react-refresh/only-export-components */
// frontend/src/context/ThemeContext.js
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const getInitialTheme = () => {
  try {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return JSON.parse(storedTheme);
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch (error) {
    console.error("Error reading theme preference:", error);
    return false;
  }
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);

    try {
      localStorage.setItem("theme", JSON.stringify(darkMode));
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      console.log("Theme changed to:", newMode ? "dark" : "light");
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
export default ThemeContext;