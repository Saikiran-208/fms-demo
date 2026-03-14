import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { fetchCurrentWeather, currentWeather as mockWeather } from "../api/weatherApi";
import { soilSensorData } from "../api/soilApi";
import { irrigationAdvisories } from "../api/irrigationApi";
import Navbar from "../components/Navbar";

// ─── Sub-components ────────────────────────────────────────────────────────────

function ProfileHeader({ farmer }) {
  const initials = (farmer?.name || "G")
    .split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="card shadow rounded-[14px] bg-card border border-border p-6 mb-6 hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
      
      <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-accent text-white flex items-center justify-center font-extrabold text-[24px] shadow-lg shadow-accent/20">
          {initials}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-1.5">
            <h1 className="m-0 text-[22px] font-bold text-text-primary">{farmer?.name}</h1>
            <span className="bg-emerald-500/10 text-emerald-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
              {farmer?.isGuest ? "Guest Access" : "Verified Farmer"}
            </span>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-text-faint uppercase tracking-wider font-bold">Farmer ID</span>
              <span className="text-[14px] font-semibold text-text-primary">FMS-{farmer?.id || "000"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-text-faint uppercase tracking-wider font-bold">Village / Block</span>
              <span className="text-[14px] font-semibold text-text-primary">{farmer?.village || "—"} / {farmer?.block || "—"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-text-faint uppercase tracking-wider font-bold">District</span>
              <span className="text-[14px] font-semibold text-text-primary">{farmer?.district || "—"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-text-faint uppercase tracking-wider font-bold">Contact</span>
              <span className="text-[14px] font-semibold text-text-primary">{farmer?.phone || "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionTile({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl border border-border bg-card hover:bg-accent hover:border-accent text-text-secondary hover:text-white transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer"
    >
      <div className="text-[28px] group-hover:scale-110 transition-transform">{item.icon}</div>
      <div className="text-[13px] font-bold">{item.label}</div>
    </button>
  );
}

function FarmAttributeItem({ label, value, icon, color }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-input/40 border border-border">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[20px]" style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div>
        <div className="text-[10px] text-text-faint uppercase tracking-[1px] font-bold">{label}</div>
        <div className="text-[15px] font-bold text-text-primary">{value}</div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function FarmerHome() {
  const { currentFarmer } = useAuth();
  const { alerts } = useApp();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(mockWeather);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentFarmer?.district) {
      fetchCurrentWeather(currentFarmer.district)
        .then(data => { setWeather(data); setLoading(false); })
        .catch(() => { setWeather(mockWeather); setLoading(false); });
    }
  }, [currentFarmer]);

  // Find relevant sensor data
  const sensor = soilSensorData.find(s => s.farmer === currentFarmer?.name) || soilSensorData[0];
  const advisory = irrigationAdvisories.find(a => a.farmer === currentFarmer?.name) || irrigationAdvisories[0];
  const recentAlerts = alerts.filter(a => !a.read).slice(0, 4);

  const quickActions = [
    { label: "Check Soil", icon: "🌱", path: "/farmer/soil" },
    { label: "Weather", icon: "🌤️", path: "/farmer/weather" },
    { label: "Market", icon: "📈", path: "/farmer/market" },
    { label: "Irrigation", icon: "💧", path: "/farmer/irrigation" },
    { label: "Profile", icon: "👤", path: "/farmer/profile" },
  ];

  return (
    <div className="bg-page min-h-screen transition-colors duration-200 font-sans">
      <Navbar title="My Farm" />

      <div className="pt-6 px-4 md:px-7 pb-10 max-w-[1400px] mx-auto">
        {/* Welcome & Compact Profile Header */}
        <div className="mb-2">
           <h1 className="m-0 text-[18px] font-semibold text-text-secondary mb-4">Good morning, Ravi!</h1>
        </div>
        <ProfileHeader farmer={currentFarmer} />

        {/* Top Grid: Attributes & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Farm Attributes */}
          <div className="lg:col-span-8 flex flex-col gap-4">
             <div className="text-[13px] font-bold text-text-faint uppercase tracking-wider">Farm Statistics</div>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <FarmAttributeItem label="Soil Moisture" value={`${sensor.moisture}%`} icon="🌊" color="#3b82f6" />
               <FarmAttributeItem label="Soil Type" value={currentFarmer?.soil || "—"} icon="🧱" color="#8b5cf6" />
               <FarmAttributeItem label="Farm Size" value={`${currentFarmer?.farmSize || 0} Acres`} icon="📐" color="#10b981" />
             </div>
             
             {/* Quick Actions Title */}
             <div className="text-[13px] font-bold text-text-faint uppercase tracking-wider mt-2">Quick Access</div>
             <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
               {quickActions.map(a => (
                 <QuickActionTile key={a.label} item={a} onClick={() => navigate(a.path)} />
               ))}
             </div>
          </div>

          {/* Weather Glance */}
          <div className="lg:col-span-4 card shadow rounded-[14px] bg-card border border-border p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <div className="text-[14px] font-bold text-text-primary uppercase tracking-wide">Weather Advisory</div>
              <span className="text-[10px] text-text-faint font-bold">{currentFarmer?.district}</span>
            </div>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="text-[54px]">{loading ? "⏳" : weather.icon}</div>
              <div>
                <div className="text-[36px] font-bold text-text-primary leading-none">{loading ? "..." : `${weather.temp}°C`}</div>
                <div className="text-[13px] text-emerald-500 font-bold mt-1 uppercase">{loading ? "Checking..." : weather.condition}</div>
              </div>
            </div>

            <div className="space-y-3.5 pt-4 border-t border-border">
              <div className="flex justify-between text-[13px]">
                <span className="text-text-faint font-medium">Humidity</span>
                <span className="text-text-primary font-bold">{weather.humidity}%</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-text-faint font-medium">Wind Speed</span>
                <span className="text-text-primary font-bold">{weather.windSpeed} km/h</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-text-faint font-medium">Visibility</span>
                <span className="text-text-primary font-bold">{weather.visibility} km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Irrigation & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Irrigation Advisory */}
          <div className="card shadow rounded-[14px] bg-card border border-border p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-5">
              <div className="text-[14px] font-bold text-text-primary uppercase tracking-wide">Irrigation Advisory</div>
              <div className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border
                ${advisory.urgency === 'High' ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}`}>
                {advisory.recommendation.toUpperCase()}
              </div>
            </div>
            
            <p className="text-[13px] text-text-secondary leading-relaxed mb-5">
              {advisory.reason}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-5 border-t border-border">
              <div>
                <div className="text-[10px] text-text-faint uppercase font-bold tracking-wider mb-1">Watering Req.</div>
                <div className="text-[14px] font-bold text-text-primary">{advisory.waterRequired}</div>
              </div>
              <div>
                <div className="text-[10px] text-text-faint uppercase font-bold tracking-wider mb-1">Ideal Window</div>
                <div className="text-[14px] font-bold text-text-primary">{advisory.suggestedTime}</div>
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="card shadow rounded-[14px] bg-card border border-border p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-5">
              <div className="text-[14px] font-bold text-text-primary uppercase tracking-wide">Recent Alerts</div>
              <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">{recentAlerts.length} NEW</span>
            </div>
            
            <div className="space-y-0 relative">
              {recentAlerts.map((a, i) => (
                <div key={a.id} className={`flex items-start gap-4 py-3.5 ${i < recentAlerts.length - 1 ? 'border-b border-border/60' : ''}`}>
                  <div className="w-9 h-9 rounded-lg bg-input flex items-center justify-center text-[18px] shrink-0">
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-text-primary truncate">{a.msg}</div>
                    <div className="text-[11px] text-text-faint mt-0.5">{a.time}</div>
                  </div>
                  <button className="text-[11px] font-bold text-accent hover:underline cursor-pointer">View</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
