import { useContext } from "react";

import { AuthContext } from "../context/AuthContext"; // Adjust the import path if needed

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
