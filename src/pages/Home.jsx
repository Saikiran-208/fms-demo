/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { farmerSummary, farmersByDistrict } from "../api/farmerApi";
import { soilSummary } from "../api/soilApi";
import { harvestSummary } from "../api/farmerApi";
import { currentWeather as mockWeather, fetchCurrentWeather } from "../api/weatherApi";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, valueColor }) {
  return (
    <div className="card shadow rounded-[14px] border border-border bg-card px-[22px] py-5 cursor-default hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="text-[28px] mb-2.5">{icon}</div>
      <div className="text-[26px] font-bold leading-none" style={valueColor ? { color: valueColor } : { color: "var(--color-text-primary)" }}>
        {value}
      </div>
      <div className="text-[13px] font-semibold text-text-primary mt-1.5">{label}</div>
      <div className="text-[12px] text-text-muted mt-1">{sub}</div>
    </div>
  );
}

function WeatherCard() {
  const [w, setW] = useState(mockWeather);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentWeather("Hyderabad")
      .then(live => { setW(live); setLoading(false); })
      .catch(() => { setW(mockWeather); setLoading(false); });
  }, []);

  const rows = [
    { icon: "🌡️", label: "Temperature", val: `${w.temp}°C (Feels ${w.feelsLike}°C)` },
    { icon: "💧", label: "Humidity", val: `${w.humidity}%` },
    { icon: "💨", label: "Wind", val: `${w.windSpeed} km/h ${w.windDir}` },
    { icon: "☀️", label: "UV Index", val: `${w.uvIndex} / 10` },
    { icon: "👁️", label: "Visibility", val: `${w.visibility} km` },
  ];
  return (
    <div className="card shadow rounded-[14px] bg-card border border-border p-[22px] hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[36px]">{loading ? "⏳" : w.icon}</span>
        <div className="flex-1">
          <div className="text-[22px] font-bold text-text-primary">
            {loading ? "Loading..." : `${w.temp}°C`}
          </div>
          <div className="text-[13px] text-text-secondary">
            {loading ? "Fetching weather..." : `${w.condition} · ${w.city}`}
          </div>
        </div>
        <span className={`text-[10px] font-bold px-[9px] py-[3px] rounded-full border ${loading ? "bg-input text-text-secondary border-border" : w.isLive ? "bg-[#22c55e] text-white border-[#22c55e]" : "bg-input text-text-secondary border-border"}`}>
          {loading ? "..." : w.isLive ? "🟢 Live" : "📋 Mock"}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {rows.map(r => (
          <div key={r.label} className="flex justify-between items-center">
            <span className="text-[13px] text-text-secondary">{r.icon} {r.label}</span>
            <span className="text-[13px] font-semibold text-text-primary">
              {loading ? "—" : r.val}
            </span>
          </div>
        ))}
      </div>
      {!loading && (
        <div className="text-[11px] text-text-secondary mt-3 text-right">
          Updated: {w.lastUpdated}
        </div>
      )}
    </div>
  );
}

function SoilCard() {
  const segments = [
    { label: "OK", count: soilSummary.ok, color: "#22c55e", bg: "#f0fdf4", desc: "Normal" },
    { label: "Low", count: soilSummary.low, color: "#f59e0b", bg: "#fffbeb", desc: "Irrigate" },
    { label: "High", count: soilSummary.high, color: "#ef4444", bg: "#fef2f2", desc: "Overwatered" },
  ];
  return (
    <div className="card shadow rounded-[14px] bg-card border border-border p-[22px] hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4.5">
        <div className="text-[15px] font-bold text-text-primary">🌱 Soil Moisture</div>
        <div className="text-[12px] text-text-secondary">{soilSummary.total} sensors</div>
      </div>
      <div className="flex h-2 rounded-lg overflow-hidden mb-4.5 gap-0.5">
        {segments.map(s => (
          <div key={s.label} className="transition-[flex] duration-400 ease-out" style={{ flex: s.count, background: s.color }} />
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        {segments.map(s => (
          <div key={s.label} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
              <span className="text-[13px] text-text-secondary">{s.label} — {s.desc}</span>
            </div>
            <span
              className="text-[12px] font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}33` }}
            >
              {s.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const alertLevelColor = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };

function AlertsCard() {
  const { alerts, alertCount } = useApp();
  const topAlerts = alerts.slice(0, 5);
  return (
    <div className="card shadow rounded-[14px] bg-card border border-border p-[22px] hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="text-[15px] font-bold text-text-primary">🔔 Active Alerts</div>
        {alertCount > 0 && (
           <div className="bg-red-500 text-white text-[11px] font-bold px-[9px] py-[2px] rounded-full">
             {alertCount} unread
           </div>
        )}
      </div>
      <div className="flex flex-col">
        {topAlerts.map((a, i) => {
          const lc = alertLevelColor[a.level] || "#6b7280";
          return (
            <div key={a.id} className={`flex gap-3 items-start py-[11px] ${i < topAlerts.length - 1 ? 'border-b border-border' : ''} ${a.read ? 'opacity-70' : ''}`}>
              <div
                className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-[17px]"
                style={{ background: `${lc}14` }}
              >
                {a.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[13px] text-text-primary whitespace-nowrap overflow-hidden text-ellipsis ${a.read ? 'font-medium' : 'font-bold'}`}>
                  {a.title || a.msg}
                </div>
                <div className="text-[11px] text-text-secondary mt-0.5">{a.time}</div>
              </div>
              <span
                className="text-[10px] font-bold rounded-full px-[7px] py-[2px] shrink-0 self-center"
                style={{ color: lc, border: `1px solid ${lc}` }}
              >
                {a.level}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuickActionButton({ a, navigate }) {
  return (
    <button
      onClick={() => navigate(a.to)}
      className="flex  flex-col items-center gap-2 py-[18px] px-3 rounded-xl cursor-pointer transition-all duration-200 border border-border border-b-2 bg-card hover:bg-accent hover:border-accent text-text-secondary hover:text-white shadow-sm hover:shadow-md group"
    >
      <span className="text-[22px] group-hover:scale-110 transition-transform">{a.icon}</span>
      <span className="text-[12px] font-semibold transition-colors duration-200 group-hover:text-white">
        {a.label}
      </span>
    </button>
  );
}

function QuickActions({ navigate }) {
  const actions = [
    { label: "View Farmers", icon: "👨‍🌾", to: "/farmers" },
    { label: "Check Soil", icon: "🌱", to: "/soil" },
    { label: "View Harvest", icon: "🌾", to: "/harvest" },
    { label: "Market Prices", icon: "📈", to: "/market" },
  ];
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3">
      {actions.map(a => <QuickActionButton key={a.to} a={a} navigate={navigate} />)}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3.5 py-2 text-[13px] text-text-primary shadow-lg dark:shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
        <div className="font-bold">{label}</div>
        <div className="text-accent">{payload[0].value} farmers</div>
      </div>
    );
  }
  return null;
};

function DistrictChart() {
  const isDark = document.documentElement.classList.contains("dark");
  const chartColors = {
    grid: isDark ? "#222222" : "#e8e8e8",
    text: isDark ? "#9ca3af" : "#6b7280",
    fill: "#22c55e"
  };

  return (
    <div className="card shadow rounded-[14px] bg-card border border-border p-[22px] hover:shadow-md transition-shadow">
      <div className="text-[15px] font-bold text-text-primary mb-5">
        📊 Farmers by District
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={farmersByDistrict} margin={{ top: 0, right: 0, left: -24, bottom: 48 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
          <XAxis
            dataKey="district"
            angle={-35} textAnchor="end"
            tick={{ fontSize: 11, fill: chartColors.text }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: chartColors.text }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? "#22c55e1A" : "#22c55e14" }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {farmersByDistrict.map((_, i) => (
              <Cell key={i} fill={chartColors.fill} fillOpacity={0.75 + (i % 3) * 0.08} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const { currentFarmer } = useAuth();
  const { alertCount } = useApp();
  const navigate = useNavigate();

  return (
    <div className="bg-page min-h-screen transition-colors duration-200 font-sans">
      <Navbar title="Dashboard Overview" />

      <div className="pt-6 px-4 md:px-7 pb-10">
        <div className="mb-[22px]">
          <h1 className="m-0 text-[20px] font-bold text-text-primary transition-colors duration-200">
            {getGreeting()},{" "}
            <span className="text-accent">{currentFarmer?.name || "Officer"}</span>
          </h1>
          <p className="m-0 mt-1 text-[13px] text-text-secondary transition-colors duration-200">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · Telangana Farm Monitoring System
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-5">
          <StatCard icon="👨‍🌾" label="Total Farmers" value={farmerSummary.total} sub="Registered in system" />
          <StatCard icon="📡" label="Active Sensors" value={`${soilSummary.ok}/${soilSummary.total}`} sub="Sensors online" valueColor="var(--color-accent)" />
          <StatCard icon="🌾" label="Harvest Ready" value={harvestSummary.ready} sub="Crops ready to harvest" valueColor="#f59e0b" />
          <StatCard icon="🔔" label="Active Alerts" value={alertCount} sub="Unread notifications" valueColor="#ef4444" />
        </div>

        <div className="card bg-card border border-border px-[22px] py-5 mb-5 hover:shadow-md transition-shadow">
          <div className="text-[13px] font-semibold text-text-secondary mb-3.5 uppercase tracking-[0.5px]">
            Quick Actions
          </div>
          <QuickActions navigate={navigate} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <WeatherCard />
          <SoilCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-5">
          <AlertsCard />
          <DistrictChart />
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}