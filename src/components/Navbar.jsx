import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar({ title }) {
  const { dark, toggleTheme } = useTheme();
  const { alerts, alertCount, markAsRead, notifOpen, setNotifOpen, searchQuery, setSearchQuery } = useApp();
  const { currentFarmer } = useAuth();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);

  const initials = (currentFarmer?.name || "G")
    .split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  const now = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <div className="h-16 bg-page border-b border-border flex items-center justify-between px-5 md:px-6 sticky top-0 z-30 shadow-sm transition-colors duration-250 font-sans">
        
        {/* Left: title */}
        <div className="text-[17px] font-bold text-text-primary transition-colors duration-200 ml-12 md:ml-0">
          {title || "Dashboard"}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2.5">
          {/* Search */}
          <input
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className={`px-3 py-1.5 rounded-lg text-[13px] bg-input text-text-primary outline-none transition-all duration-200 ${searchFocused ? 'border-1.5 border-accent w-[140px] sm:w-[220px]' : 'border-1.5 border-border w-[100px] sm:w-[180px] hover:border-text-muted'}`}
          />

          {/* Date — hidden on mobile */}
          <div className="hidden md:block text-[13px] text-text-secondary whitespace-nowrap transition-colors duration-200">
            {now}
          </div>

          {/* Dark/Light toggle — sun ☀️ / moon 🌙 */}
          <button
            onClick={toggleTheme}
            title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="w-9 h-9 flex items-center justify-center shrink-0 rounded-lg border-1.5 border-border bg-input hover:bg-accent/20 cursor-pointer text-[17px] transition-all duration-200"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setNotifOpen(o => !o)}
            className={`w-9 h-9 flex items-center justify-center shrink-0 rounded-lg cursor-pointer transition-all duration-200 relative
              ${notifOpen ? 'bg-accent border-1.5 border-accent' : 'bg-input border-1.5 border-border hover:bg-accent/20'}`}
          >
            <span className="text-[17px]">🔔</span>
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-page">
                {alertCount}
              </span>
            )}
          </button>

          {/* Avatar */}
          <div
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-extrabold text-[14px] shrink-0 cursor-pointer border-2 border-border hover:opacity-90 transition-all duration-200"
          >
            {initials}
          </div>
        </div>
      </div>

      {/* Notification Drawer */}
      {notifOpen && (
        <>
          <div className="fixed inset-0 z-[150]" onClick={() => setNotifOpen(false)} />
          <div className="fixed top-16 right-0 w-[340px] max-w-[95vw] bg-card border-l border-b border-border rounded-bl-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.13)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.6)] z-[200] max-h-[calc(100vh-64px)] overflow-y-auto transition-all duration-200 font-sans">
            <div className="py-4 px-4 border-b border-border flex justify-between items-center">
              <div className="font-bold text-[15px] text-text-primary">
                🔔 Alerts 
                <span className="bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full ml-1.5">
                  {alertCount} high
                </span>
              </div>
              <button onClick={() => setNotifOpen(false)} className="bg-transparent border-none cursor-pointer text-[18px] text-text-secondary hover:text-text-primary transition-colors duration-200">
                ✕
              </button>
            </div>
            
            <div className="p-3">
              {alerts.slice(0, 5).map((a) => {
                const isRead = a.read;
                const levelC = a.level === "High" ? "text-red-500 bg-red-500/10 border-red-500" : 
                               a.level === "Medium" ? "text-amber-500 bg-amber-500/10 border-amber-500" : 
                               "text-green-500 bg-green-500/10 border-green-500";
                return (
                  <div key={a.id} className={`flex gap-3 px-3 py-2.5 rounded-[10px] mb-1.5 items-start border-l-3 transition-colors ${levelC} ${isRead ? 'opacity-60' : ''}`}>
                    <span className="text-[18px] shrink-0 mt-0.5">{a.icon || "🔔"}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[13px] text-text-primary leading-[1.4] ${isRead ? 'font-medium' : 'font-bold'}`}>{a.msg || a.title}</div>
                      <div className="flex justify-between items-center mt-1.5">
                        <span className="text-[11px] text-text-secondary">{a.time}</span>
                        <div className="flex gap-2 items-center">
                          <span className={`text-[10px] font-bold ${a.level === "High" ? "text-red-500" : a.level === "Medium" ? "text-amber-500" : "text-green-500"}`}>
                            {a.level}
                          </span>
                          {!isRead && (
                             <button
                               onClick={(e) => { e.stopPropagation(); markAsRead(a.id); }}
                               className="text-[10px] font-semibold text-accent hover:text-accent/80 bg-transparent border-none cursor-pointer p-0"
                             >
                               Mark Read
                             </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="px-4 py-3 border-t border-border">
              <button 
                onClick={() => { navigate("/notifications"); setNotifOpen(false); }} 
                className="w-full py-2 bg-accent/15 border border-accent rounded-lg text-accent font-bold text-[13px] cursor-pointer hover:bg-accent/25 transition-all duration-200"
              >
                View All Notifications →
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}