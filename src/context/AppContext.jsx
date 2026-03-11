/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { notificationsLog, notifTypeIcon } from "../api/notificationsApi";

const AppContext = createContext();

const initialAlerts = notificationsLog.map(n => ({
  id:    n.id,
  type:  n.type,
  icon:  notifTypeIcon[n.type] || "🔔",
  title: n.title,
  msg:   n.body,
  time:  n.time,
  level: n.level,
  read:  n.read,
}));

export function AppProvider({ children }) {
  const [notifOpen, setNotifOpen]           = useState(false);
  const [searchQuery, setSearchQuery]       = useState("");
  const [jurisdiction, setJurisdiction]     = useState(["All"]);
  const [language, setLanguage]             = useState("en");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifPrefs, setNotifPrefs]         = useState({
    highAlerts: true, mediumAlerts: true, priceChanges: true, harvestReady: true,
  });

  const [alerts, setAlerts]                 = useState(initialAlerts);
  
  const markAsRead = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };
  
  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const markAsUnread = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: false } : a));
  };

  return (
    <AppContext.Provider value={{
      alerts,
      setAlerts,
      alertCount: alerts.filter(a => !a.read).length,
      markAsRead,
      markAllAsRead,
      markAsUnread,
      notifOpen, setNotifOpen,
      searchQuery, setSearchQuery,
      jurisdiction, setJurisdiction,
      language, setLanguage,
      sidebarCollapsed, setSidebarCollapsed,
      notifPrefs, setNotifPrefs,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

