import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import FarmerStats from "./pages/FarmerStats";
import SoilMonitor from "./pages/SoilMonitor";
import HarvestStatus from "./pages/HarvestStatus";
import WeatherAdvisory from "./pages/WeatherAdvisory";
import MarketPrices from "./pages/MarketPrices";
import MapView from "./pages/MapView";
import Settings from "./pages/Settings";
import IrrigationAdvisory from "./pages/IrrigationAdvisory";
import FarmerProfile from "./pages/FarmerProfile";
import Notifications from "./pages/Notifications";
import FarmerHome from "./pages/FarmerHome";

import { useApp } from './context/AppContext';

function FarmerLayout() {
  const { isAuthenticated, role } = useAuth();
  const { sidebarCollapsed } = useApp();
  const SIDEBAR_W = sidebarCollapsed ? "68px" : "232px";

  if (!isAuthenticated || role !== "farmer") return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen">
      <Sidebar role="farmer" />
      <div
        className="flex-1 min-w-0 transition-all duration-250 ease-in-out md:ml-[var(--sidebar-w)]"
        style={{ "--sidebar-w": SIDEBAR_W }}
      >
        <Outlet />
      </div>
    </div>
  );
}

function AdminLayout() {
  const { isAuthenticated, role } = useAuth();
  const { sidebarCollapsed } = useApp();
  const SIDEBAR_W = sidebarCollapsed ? "68px" : "232px";

  if (!isAuthenticated || role !== "admin") return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen">
      <Sidebar role="admin" />
      <div
        className="flex-1 min-w-0 transition-all duration-250 ease-in-out md:ml-[var(--sidebar-w)]"
        style={{ "--sidebar-w": SIDEBAR_W }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      
      {/* Farmer Side */}
      <Route path="/farmer" element={<FarmerLayout />}>
        <Route index element={<FarmerHome />} />
        <Route path="soil" element={<SoilMonitor />} />
        <Route path="weather" element={<WeatherAdvisory />} />
        <Route path="market" element={<MarketPrices />} />
        <Route path="irrigation" element={<IrrigationAdvisory />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<FarmerProfile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Admin Side */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Home />} />
        <Route path="farmers" element={<FarmerStats />} />
        <Route path="soil" element={<SoilMonitor />} />
        <Route path="harvest" element={<HarvestStatus />} />
        <Route path="weather" element={<WeatherAdvisory />} />
        <Route path="market" element={<MarketPrices />} />
        <Route path="map" element={<MapView />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Root Directing */}
      <Route path="/" element={<Navigate to={isAuthenticated ? (role === "admin" ? "/admin" : "/farmer") : "/login"} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}