import { useState } from "react";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
// import SummaryBanner from "../components/SummaryBanner";
import { soilSensorData, moistureTrendData, soilSummary, getIrrigationSuggestion } from "../api/soilApi";
import { getStatusColor, getMoistureLabel, formatTime } from "../utils/helpers";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

function speak(text, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-IN"; u.rate = 0.9; u.pitch = 1;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
}

function exportCSV() {
  const headers = ["Sensor ID", "Location", "District", "Farmer", "Crop", "Moisture %", "Status", "Battery %", "Timestamp"];
  const rows = soilSensorData.map(s =>
    [s.sensor_id, s.location, s.district, s.farmer, s.crop, s.moisture, s.status, s.battery, s.timestamp]
  );
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "soil_sensor_readings.csv"; a.click();
}

export default function SoilMonitor() {
  const [filter, setFilter] = useState("All");
  const [speaking, setSpeaking] = useState(null);

  const statuses = ["All", "OK", "Low", "High"];
  const filtered = filter === "All" ? soilSensorData : soilSensorData.filter(s => s.status === filter);

  function handleVoice(sensor) {
    const text = `Sensor ${sensor.sensor_id} in ${sensor.location}. Moisture is ${sensor.moisture} percent. Status: ${sensor.status}. Farmer: ${sensor.farmer}. Crop: ${sensor.crop}.`;
    if (speaking === sensor.sensor_id) { window.speechSynthesis.cancel(); setSpeaking(null); return; }
    speak(text, () => setSpeaking(null));
    setSpeaking(sensor.sensor_id);
  }

  return (
    <div className="bg-page min-h-screen transition-colors duration-250 font-sans">
      <Navbar title="Soil Moisture Monitor" />
      <div className="pt-6 px-4 md:px-7 pb-10">

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <StatCard icon="📡" label="Total Sensors" value={soilSummary.total} sub="Deployed" />
          <StatCard icon="✅" label="Status OK" value={soilSummary.ok} sub="Normal moisture" color="#27AE60" />
          <StatCard icon="🟡" label="Low Moisture" value={soilSummary.low} sub="Needs irrigation" color="#F4A300" />
          <StatCard icon="🔴" label="High Moisture" value={soilSummary.high} sub="Overwatered" color="#E74C3C" />
          <StatCard icon="📊" label="Avg Moisture" value={`${soilSummary.avgMoisture}%`} sub="All sensors" color="#2471a3" />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="m-0 mb-5 text-[16px] font-bold text-text-primary">
            7-Day Moisture Trend (Top 5 Sensors)
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={moistureTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(val) => `${val}%`} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Legend />
              <Line type="monotone" dataKey="S001" stroke="#4ade80" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="S002" stroke="#F4A300" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="S003" stroke="#E74C3C" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="S004" stroke="#2471a3" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="S005" stroke="#7d3c98" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Filter + Export row */}
        <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
          <div className="flex gap-1.5 p-1 bg-input rounded-[10px] w-fit">
            {statuses.map(s => (
              <button
                key={s}
                className={`px-3.5 py-1.5 rounded-lg border-none cursor-pointer font-bold text-[12px] transition-colors duration-200 ${filter === s ? "bg-accent/15 dark:bg-accent/20 text-accent shadow-sm" : "bg-transparent text-text-muted hover:text-text-primary"}`}
                onClick={() => setFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-[11px] text-text-muted">🔊 Click speaker for voice</span>
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-accent/10 dark:bg-accent/20 text-accent border border-accent/20 rounded-[10px] font-bold text-[12px] cursor-pointer hover:bg-accent/20 transition-colors whitespace-nowrap"
            >
              ⬇ Export CSV
            </button>
          </div>
        </div>

        {/* Sensor Cards */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {filtered.map((sensor) => {
            const colors = getStatusColor(sensor.status);
            const label = getMoistureLabel(sensor.moisture);
            const irrig = getIrrigationSuggestion(sensor.moisture, sensor.crop);
            const battColor = sensor.battery < 20 ? "#c0392b" : sensor.battery < 50 ? "#e67e22" : "#27AE60";

            return (
              <div
                key={sensor.sensor_id}
                className="bg-card rounded-xl p-5 cursor-pointer shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                style={{ border: `1.5px solid ${colors.border}` }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-2.5">
                  <div className="flex-1">
                    <div className="font-bold text-[15px] text-text-primary">{sensor.sensor_id}</div>
                    <div className="text-[12px] text-text-muted mt-0.5">{sensor.location}</div>
                    <div className="text-[11px] text-text-faint">{sensor.district}</div>
                  </div>
                  <div className="flex flex-col gap-1.5 items-end">
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                      style={{ background: colors.bg, color: colors.text }}
                    >
                      {sensor.status}
                    </span>
                    {/* Voice button */}
                    <button
                      onClick={e => { e.stopPropagation(); handleVoice(sensor); }}
                      className="w-7 h-7 border-none rounded-lg cursor-pointer text-[13px] flex items-center justify-center transition-colors"
                      style={{ background: speaking === sensor.sensor_id ? "#4ade80" : "var(--color-border)" }}
                    >
                      {speaking === sensor.sensor_id ? "⏹️" : "🔊"}
                    </button>
                  </div>
                </div>

                {/* Moisture bar */}
                <div className="mb-2.5">
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] text-text-muted">Moisture</span>
                    <span className="text-[14px] font-extrabold" style={{ color: colors.text }}>{sensor.moisture}%</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-[width] duration-400 ease-out" style={{ width: `${sensor.moisture}%`, background: colors.text }} />
                  </div>
                </div>

                {/* Battery + Irrigation */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-semibold" style={{ color: battColor }}>🔋 {sensor.battery}%</span>
                  <span className="text-[11px] font-bold" style={{ color: irrig.urgency === "High" ? "#c0392b" : irrig.urgency === "Medium" ? "#e67e22" : "#27AE60" }}>
                    {irrig.icon} {irrig.action}
                  </span>
                </div>

                <div className="text-[12px] font-semibold mb-1" style={{ color: colors.text }}>{label}</div>

                {/* Farmer + Crop tags */}
                <div className="flex gap-1.5 flex-wrap mt-2">
                  <span className="text-[11px] bg-page border border-border rounded-md px-2 py-0.5 text-text-muted">
                    👤 {sensor.farmer}
                  </span>
                  <span className="text-[11px] bg-page border border-border rounded-md px-2 py-0.5 text-text-muted">
                    🌾 {sensor.crop}
                  </span>
                </div>

                <div className="text-[10px] text-text-faint mt-2">
                  {formatTime(sensor.timestamp)}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}