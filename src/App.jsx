import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Home from './pages/Home';
import FarmerStats from './pages/FarmerStats';
import SoilMonitor from './pages/SoilMonitor';
import HarvestStatus from './pages/HarvestStatus';
import WeatherAdvisory from './pages/WeatherAdvisory';
import MarketPrices from './pages/MarketPrices';
import MapView from './pages/MapView';
import Settings from './pages/Settings';
import IrrigationAdvisory from './pages/IrrigationAdvisory';
import FarmerProfile from './pages/FarmerProfile';
import Notifications from './pages/Notifications';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

import { useApp } from './context/AppContext';

function AppLayout() {
  const { sidebarCollapsed } = useApp();
  const SIDEBAR_W = sidebarCollapsed ? "68px" : "232px";
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* main-content pushes right of the fixed desktop sidebar */}
      <div 
        className="flex-1 min-w-0 transition-all duration-250 ease-in-out md:ml-[var(--sidebar-w)]"
        style={{ "--sidebar-w": SIDEBAR_W }}
      >
        <Routes>
          <Route path="/"              element={<Home />}               />
          <Route path="/farmers"       element={<FarmerStats />}        />
          <Route path="/soil"          element={<SoilMonitor />}        />
          <Route path="/harvest"       element={<HarvestStatus />}      />
          <Route path="/weather"       element={<WeatherAdvisory />}    />
          <Route path="/market"        element={<MarketPrices />}       />
          <Route path="/irrigation"    element={<IrrigationAdvisory />} />
          <Route path="/map"           element={<MapView />}            />
          <Route path="/notifications" element={<Notifications />}      />
          <Route path="/profile"       element={<FarmerProfile />}      />
          <Route path="/settings"      element={<Settings />}           />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;