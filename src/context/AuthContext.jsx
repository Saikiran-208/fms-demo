/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const GUEST_FARMER = {
  id: 0,
  name: "Guest",
  village: "—",
  block: "—",
  district: "Hyderabad",
  soil: "Black",
  farmSize: 0,
  crop: "Paddy",
  phone: "0000000000",
  isGuest: true,
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("fms_auth")) || false; }
    catch { return false; }
  });

  const [isGuest, setIsGuest] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("fms_guest")) || false; }
    catch { return false; }
  });

  const [role, setRole] = useState(() => {
    return sessionStorage.getItem("fms_role") || null;
  });

  const [currentFarmer, setCurrentFarmer] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("fms_farmer")) || null; }
    catch { return null; }
  });

  const ADMIN_USER = {
    id: 1,
    name: "Admin Officer",
    district: "State HQ",
    role: "admin",
  };

  function login(farmer) {
    setIsAuthenticated(true);
    setIsGuest(false);
    setRole("farmer");
    setCurrentFarmer(farmer);
    sessionStorage.setItem("fms_auth", JSON.stringify(true));
    sessionStorage.setItem("fms_guest", JSON.stringify(false));
    sessionStorage.setItem("fms_role", "farmer");
    sessionStorage.setItem("fms_farmer", JSON.stringify(farmer));
  }

  function loginAsGuest() {
    setIsAuthenticated(true);
    setIsGuest(true);
    setRole("farmer");
    setCurrentFarmer(GUEST_FARMER);
    sessionStorage.setItem("fms_auth", JSON.stringify(true));
    sessionStorage.setItem("fms_guest", JSON.stringify(true));
    sessionStorage.setItem("fms_role", "farmer");
    sessionStorage.setItem("fms_farmer", JSON.stringify(GUEST_FARMER));
  }

  function loginAsAdmin() {
    setIsAuthenticated(true);
    setIsGuest(false);
    setRole("admin");
    setCurrentFarmer(ADMIN_USER);
    sessionStorage.setItem("fms_auth", JSON.stringify(true));
    sessionStorage.setItem("fms_guest", JSON.stringify(false));
    sessionStorage.setItem("fms_role", "admin");
    sessionStorage.setItem("fms_farmer", JSON.stringify(ADMIN_USER));
  }

  function logout() {
    setIsAuthenticated(false);
    setIsGuest(false);
    setRole(null);
    setCurrentFarmer(null);
    sessionStorage.removeItem("fms_auth");
    sessionStorage.removeItem("fms_guest");
    sessionStorage.removeItem("fms_role");
    sessionStorage.removeItem("fms_farmer");
  }

  function updateProfile(updated) {
    const next = { ...currentFarmer, ...updated };
    setCurrentFarmer(next);
    sessionStorage.setItem("fms_farmer", JSON.stringify(next));
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isGuest, role, currentFarmer, login, loginAsGuest, loginAsAdmin, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
