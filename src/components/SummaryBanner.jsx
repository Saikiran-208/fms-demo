import { useApp } from "../context/AppContext";

export default function SummaryBanner({ weather }) {
  const { alerts } = useApp();
  const urgentCount = alerts.filter(a => a.level === "High").length;

  return (
    <div className="summary-banner">
      <span>🌡️ <strong style={{ color: "#4ade80" }}>
        {weather ? `${Math.round(weather.main.temp)}°C` : "32°C"}
      </strong> Hyderabad</span>
      <span style={{ opacity: 0.4 }}>|</span>
      <span>🌾 Paddy <strong style={{ color: "#4ade80" }}>₹2,100</strong>
        <span style={{ color: "#27AE60", marginLeft: 4, fontSize: 11 }}>▲</span>
      </span>
      <span style={{ opacity: 0.4 }}>|</span>
      <span>🌱 Cotton <strong style={{ color: "#4ade80" }}>₹6,200</strong>
        <span style={{ color: "#27AE60", marginLeft: 4, fontSize: 11 }}>▲</span>
      </span>
      <span style={{ opacity: 0.4 }}>|</span>
      <span style={{ color: urgentCount > 0 ? "#f87171" : "#4ade80" }}>
        ⚠️ <strong>{urgentCount}</strong> Urgent Alert{urgentCount !== 1 ? "s" : ""}
      </span>
      <span style={{ opacity: 0.4 }}>|</span>
      <span style={{ opacity: 0.6, fontSize: 11 }}>
        Last sync: {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}
