import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

const farmerNavItems = [
  { path: "/farmer", label: "My Farm", icon: "🏠", desc: "Overview" },
  { path: "/farmer/soil", label: "Soil Monitor", icon: "🌱", desc: "Moisture levels" },
  { path: "/farmer/weather", label: "Weather", icon: "🌤️", desc: "Forecasts & risks" },
  { path: "/farmer/market", label: "Market Prices", icon: "📈", desc: "Mandi rates" },
  { path: "/farmer/irrigation", label: "Irrigation", icon: "💧", desc: "Smart advisory" },
  { path: "/farmer/notifications", label: "Notifications", icon: "🔔", desc: "Alerts & updates" },
  { path: "/farmer/settings", label: "Settings", icon: "⚙️", desc: "Preferences" },
];

const adminNavItems = [
  { path: "/admin", label: "Dashboard", icon: "📊", desc: "Overview" },
  { path: "/admin/farmers", label: "Farmers", icon: "👨‍🌾", desc: "Registrations" },
  { path: "/admin/soil", label: "Soil Monitor", icon: "🌱", desc: "Moisture levels" },
  { path: "/admin/harvest", label: "Harvest", icon: "🌾", desc: "Crop readiness" },
  { path: "/admin/weather", label: "Weather", icon: "🌤️", desc: "Forecasts & risks" },
  { path: "/admin/market", label: "Market Prices", icon: "📈", desc: "Mandi rates" },
  { path: "/admin/map", label: "District Overview", icon: "🗺️", desc: "Telangana map" },
  { path: "/admin/notifications", label: "Notifications", icon: "🔔", desc: "Alerts & updates" },
  { path: "/admin/settings", label: "Settings", icon: "⚙️", desc: "Preferences" },
];

function NavItems({ role, collapsed, unreadCount, onClick }) {
  const items = role === "admin" ? adminNavItems : farmerNavItems;
  return (
    <>
      {items.map((item) => (
        <NavLink key={item.path} to={item.path} end={item.path === "/farmer" || item.path === "/admin"}
          onClick={onClick}
          title={collapsed ? item.label : ""}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-[10px] no-underline transition-all duration-200 relative mb-0.5
            ${collapsed ? "py-3 justify-center" : "py-[9px] px-3 justify-start"}
            ${isActive ? "bg-accent/10 dark:bg-accent/20 text-accent" : "text-text-secondary hover:bg-input"}`
          }>
          {({ isActive }) => (
            <>
              {isActive && !collapsed && (
                <div className="absolute left-0 top-1/5 bottom-1/5 w-[3px] bg-accent rounded-r-[3px]" />
              )}
              <span className="text-[18px] shrink-0 relative">
                {item.icon}
                {item.path.includes("notifications") && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </span>
              {!collapsed && (
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-[13px] whitespace-nowrap text-inherit">{item.label}</div>
                    <div className="text-[11px] text-text-faint whitespace-nowrap">{item.desc}</div>
                  </div>
                  {item.path.includes("notifications") && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-[1px] rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </NavLink>
      ))}
    </>
  );
}

function Footer({ collapsed, farmer, onProfileClick }) {
  const initials = (farmer?.name || "G")
    .split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div
      className={`border-t border-border flex items-center gap-2.5 cursor-pointer hover:bg-input transition-all duration-200 rounded-lg mx-2 mb-2
        ${collapsed ? "py-3.5 justify-center" : "py-3.5 px-4 justify-start"}`}
      onClick={onProfileClick}
      title="View Profile"
    >
      <div className="w-[34px] h-[34px] rounded-full bg-accent text-white flex items-center justify-center font-extrabold text-[13px] shrink-0 transition-all duration-200">
        {initials}
      </div>
      {!collapsed && (
        <div className="overflow-hidden">
          <div className="text-[13px] font-semibold text-text-secondary overflow-hidden text-ellipsis whitespace-nowrap transition-colors duration-200">
            {farmer?.name || "Officer"}
          </div>
          <div className="text-[11px] text-text-faint transition-colors duration-200">
            {farmer?.district || "Telangana"} · Profile
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ role }) {
  const { currentFarmer, logout } = useAuth();
  const { setSidebarCollapsed, alertCount: unreadCount } = useApp();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    setSidebarCollapsed(next); // sync to context for AppLayout margin
  }

  function goProfile() { navigate(role === "admin" ? "/admin/settings" : "/farmer/profile"); setMobileOpen(false); }

  const SIDEBAR_W = collapsed ? "68px" : "232px";

  const sidebarBaseClasses = "bg-page border-r border-border transition-all duration-250 flex flex-col font-sans h-screen z-40 overflow-x-hidden overflow-y-auto";

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-[45] md:hidden"
        />
      )}

      {/* Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3.5 left-3.5 z-[50] bg-page border border-border rounded-lg w-10 h-10 cursor-pointer flex items-center justify-center shadow-sm md:hidden transition-all duration-200"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-accent" strokeWidth="2.5" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Desktop Sidebar — position FIXED so it stays on scroll */}
      <aside
        className={`hidden md:flex fixed top-0 left-0 ${sidebarBaseClasses} z-40`}
        style={{ width: SIDEBAR_W }}
      >
        {/* Logo */}
        <div className={`border-b border-border flex items-center min-h-[64px] transition-all duration-250 shrink-0
          ${collapsed ? "py-4 px-0 justify-center" : "py-4 px-4 justify-between"}`}
        >
          {collapsed
            ? <span className="text-[22px]">🌿</span>
            : <div>
              <div className="text-[18px] font-extrabold text-accent tracking-[-0.5px]">🌿 {role === "admin" ? "OFFICER" : "FMS"}</div>
              <div className="text-[10px] text-text-faint tracking-[1.5px] mt-0.5">{role === "admin" ? "ADMIN PANEL" : "FARM MONITORING"}</div>
            </div>
          }
          <button
            onClick={toggleCollapse}
            className={`bg-accent/15 border border-border rounded-md w-7 h-7 cursor-pointer text-accent flex items-center justify-center shrink-0 text-[12px] transition-all duration-250 ${collapsed ? "rotate-180" : "rotate-0"}`}
          >
            ◀
          </button>
        </div>

        <nav className="flex-1 p-2.5 flex flex-col pt-4">
          <NavItems role={role} collapsed={collapsed} unreadCount={unreadCount} />
          
          {/* Logout Section */}
          <div className="mt-auto px-1 pb-2">
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className={`w-full flex items-center gap-3 rounded-[10px] border-none bg-transparent text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 cursor-pointer
                ${collapsed ? "py-3 justify-center" : "py-[9px] px-3 justify-start"}`}
              title={collapsed ? "Logout" : ""}
            >
              <span className="text-[18px] shrink-0">🚪</span>
              {!collapsed && (
                <div className="flex-1 text-left">
                  <div className="font-semibold text-[13px] whitespace-nowrap">Logout</div>
                  <div className="text-[11px] text-red-400/80 whitespace-nowrap text-ellipsis overflow-hidden">End session</div>
                </div>
              )}
            </button>
          </div>
        </nav>
        <Footer collapsed={collapsed} farmer={currentFarmer} onProfileClick={goProfile} />
      </aside>

      {/* Mobile Drawer */}
      <aside
        className={`md:hidden fixed top-0 ${sidebarBaseClasses} w-[232px] md:w-auto shadow-xl duration-300 z-[50]
        ${mobileOpen ? "left-0" : "-left-64"}`}
      >
        <div className="py-4 px-4 border-b border-border flex items-center justify-between min-h-[64px]">
          <div>
            <div className="text-[18px] font-extrabold text-accent">🌿 {role === "admin" ? "OFFICER" : "FMS"}</div>
            <div className="text-[10px] text-text-faint tracking-[1.5px]">{role === "admin" ? "ADMIN PANEL" : "FARM MONITORING"}</div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="bg-accent/15 border border-border rounded-md w-7 h-7 cursor-pointer text-accent text-[14px] transition-all duration-200"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 p-2.5 flex flex-col overflow-y-auto">
          <NavItems role={role} collapsed={false} unreadCount={unreadCount} onClick={() => setMobileOpen(false)} />
          
          {/* Mobile Logout */}
          <div className="mt-auto border-t border-border pt-2">
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="w-full flex items-center gap-3 py-3 px-3 rounded-[10px] border-none bg-transparent text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 cursor-pointer"
            >
              <span className="text-[18px] shrink-0">🚪</span>
              <div className="flex-1 text-left">
                <div className="font-semibold text-[13px]">Logout</div>
                <div className="text-[11px] text-red-400/80">End session</div>
              </div>
            </button>
          </div>
        </nav>
        <Footer collapsed={false} farmer={currentFarmer} onProfileClick={goProfile} />
      </aside>
    </>
  );
}