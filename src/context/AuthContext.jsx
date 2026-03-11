/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("fms_auth")) || false; }
    catch { return false; }
  });

  const [currentFarmer, setCurrentFarmer] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("fms_farmer")) || null; }
    catch { return null; }
  });

  function login(farmer) {
    setIsAuthenticated(true);
    setCurrentFarmer(farmer);
    sessionStorage.setItem("fms_auth",   JSON.stringify(true));
    sessionStorage.setItem("fms_farmer", JSON.stringify(farmer));
  }

  function logout() {
    setIsAuthenticated(false);
    setCurrentFarmer(null);
    sessionStorage.removeItem("fms_auth");
    sessionStorage.removeItem("fms_farmer");
  }

  function updateProfile(updated) {
    const next = { ...currentFarmer, ...updated };
    setCurrentFarmer(next);
    sessionStorage.setItem("fms_farmer", JSON.stringify(next));
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentFarmer, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
