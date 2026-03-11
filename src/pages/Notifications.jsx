import { useState } from "react";
import Navbar from "../components/Navbar";
import { notifTypeIcon, notifTypeBg } from "../api/notificationsApi";
import { useApp } from "../context/AppContext";

const TABS = ["All", "Unread", "Weather", "Irrigation", "Harvest", "Market", "System"];

const levelColor = { High: "#fdecea", Medium: "#fff3e0", Low: "#e6f4ea" };
const levelText  = { High: "#c0392b", Medium: "#e67e22", Low: "#27AE60" };

export default function Notifications() {
  const { alerts, alertCount: unreadCount, markAsRead, markAllAsRead, markAsUnread } = useApp();
  const [activeTab, setActiveTab]   = useState("All");

  const filtered = alerts.filter(n => {
    if (activeTab === "All")    return true;
    if (activeTab === "Unread") return !n.read;
    return n.type === activeTab.toLowerCase();
  });

  return (
    <div className="bg-page min-h-screen transition-colors duration-250 font-sans">
      <Navbar title="Notifications" />
      <div className="pt-6 px-4 md:px-7 pb-10">

        {/* Header row */}
        <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
          <div>
            <h2 className="m-0 text-[20px] font-bold text-text-primary flex items-center">
              🔔 Notifications
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E74C3C] text-white text-[11px] font-extrabold ml-2.5">
                  {unreadCount}
                </span>
              )}
            </h2>
            <p className="m-0 mt-1 text-[13px] text-text-muted">
              {unreadCount} unread · {alerts.length} total
            </p>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead} 
              className="px-4.5 py-2 bg-border text-text-secondary border-none rounded-[10px] font-bold text-[13px] cursor-pointer transition-colors hover:bg-black/5"
            >
              ✓ Mark All Read
            </button>
          )}
        </div>

        {/* Stat summary row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-5">
          {[
            { icon: "🔴", label: "Unread",     val: unreadCount },
            { icon: "🌧️", label: "Weather",    val: alerts.filter(n => n.type === "weather").length    },
            { icon: "💧", label: "Irrigation",  val: alerts.filter(n => n.type === "irrigation").length },
            { icon: "🌾", label: "Harvest",     val: alerts.filter(n => n.type === "harvest").length    },
            { icon: "📈", label: "Market",      val: alerts.filter(n => n.type === "market").length     },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center shadow-sm">
              <div className="text-[22px] mb-1">{s.icon}</div>
              <div className="text-[22px] font-extrabold text-text-primary">{s.val}</div>
              <div className="text-[12px] text-text-muted">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-4 bg-input rounded-xl p-1 w-fit overflow-x-auto max-w-full">
          {TABS.map(t => (
            <button 
              key={t} 
              className={`px-[18px] py-1.5 rounded-[10px] border-none cursor-pointer font-bold text-[13px] whitespace-nowrap transition-colors duration-200 ${activeTab === t ? "bg-accent/15 dark:bg-accent/20 text-accent shadow-sm" : "bg-transparent text-text-muted hover:text-text-primary"}`}
              onClick={() => setActiveTab(t)}
            >
              {t}{t === "Unread" && unreadCount > 0 ? ` (${unreadCount})` : ""}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-[40px] mb-3">✅</div>
              <div className="text-[16px] font-bold text-text-primary">All caught up!</div>
              <div className="text-[13px] text-text-muted mt-1.5">No notifications in this category.</div>
            </div>
          ) : (
            filtered.map((n) => {
              const isRead = n.read;
              const lc = levelColor[n.level] || "#f5f5f5";
              const lt = levelText[n.level]  || "#555";
              return (
                <div 
                  key={n.id} 
                  className={`flex gap-3.5 p-4 px-5 items-start transition-colors duration-200 border-b border-border/50 last:border-0 ${isRead ? "bg-card hover:bg-black/5" : "bg-accent/10 hover:bg-accent/20"}`}
                >
                  {/* Type icon */}
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[20px] shrink-0"
                    style={{ background: notifTypeBg[n.type] || "#f5f5f5" }}
                  >
                    {notifTypeIcon[n.type] || "🔔"}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1 flex-wrap">
                      <div className={`text-[14px] text-text-primary ${isRead ? "font-semibold" : "font-extrabold"}`}>
                        {n.title}
                      </div>
                      <div className="flex gap-1.5 items-center shrink-0">
                        <span 
                          className="text-[10px] font-bold px-2 py-[2px] rounded-full"
                          style={{ color: lt, background: lc }}
                        >
                          {n.level}
                        </span>
                        {!isRead && (
                          <div className="w-2 h-2 rounded-full bg-[#4ade80]" />
                        )}
                      </div>
                    </div>
                    <p className="m-0 mb-2 text-[13px] text-text-secondary leading-relaxed">{n.body}</p>
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-[11px] text-text-muted">{n.time}</span>
                      <button 
                        onClick={() => isRead ? markAsUnread(n.id) : markAsRead(n.id)} 
                        className={`bg-transparent border-none cursor-pointer text-[11px] font-bold p-0 transition-colors ${isRead ? "text-text-muted hover:text-text-primary" : "text-[#4ade80] hover:text-[#38a169]"}`}
                      >
                        {isRead ? "Mark Unread" : "Mark Read"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
