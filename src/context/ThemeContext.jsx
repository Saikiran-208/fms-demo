/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fms_dark")) || false; }
    catch { return false; }
  });

  const toggleTheme = () => setDark(d => {
    const next = !d;
    localStorage.setItem("fms_dark", JSON.stringify(next));
    return next;
  });

  // Apply CSS class for Tailwind's dark: mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

