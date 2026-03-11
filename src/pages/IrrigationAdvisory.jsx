import { useState } from "react";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import {
  irrigationAdvisories, irrigationSummary, irrigationForecastData, cropIrrigationRules,
} from "../api/irrigationApi";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const urgencyStyle = {
  High:   { bg: "#fdecea", text: "#c0392b", border: "#c0392b" },
  Medium: { bg: "#fff3e0", text: "#e67e22", border: "#e67e22" },
  Low:    { bg: "#e6f4ea", text: "#27AE60", border: "#27AE60" },
  None:   { bg: "#f0faf4", text: "#27AE60", border: "#27AE60" },
};

const recIcon = {
  "Water Now":          "💧",
  "Wait — Rain Expected":"🌧️",
  "OK":                 "✅",
  "Skip — Overwatered": "⚠️",
};

// Browser Text-to-Speech (Voice Advisory)
function speak(text, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-IN"; u.rate = 0.92; u.pitch = 1;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
}

const FILTERS = ["All", "Water Now", "Wait — Rain Expected", "OK", "Skip — Overwatered"];

export default function IrrigationAdvisory() {
  const [filter, setFilter] = useState("All");
  const [speaking, setSpeaking] = useState(null);

  const shown = filter === "All"
    ? irrigationAdvisories
    : irrigationAdvisories.filter(a => a.recommendation === filter);

  function handleVoice(a) {
    if (speaking === a.id) { window.speechSynthesis.cancel(); setSpeaking(null); return; }
    speak(`${a.farmer}. ${a.recommendation}. ${a.reason} Irrigate between ${a.suggestedTime}.`, () => setSpeaking(null));
    setSpeaking(a.id);
  }

  return (
    <div className="bg-page min-h-screen transition-colors duration-250 font-sans">
      <Navbar title="Smart Irrigation Advisory" />
      <div className="pt-6 px-4 md:px-7 pb-10">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <StatCard icon="🌾" label="Monitored Farms"  value={irrigationSummary.totalFarms}   sub="Active sensors"        />
          <StatCard icon="💧" label="Water Now"         value={irrigationSummary.needsWaterNow} sub="Critical"              color="#c0392b" />
          <StatCard icon="🌧️" label="Wait for Rain"    value={irrigationSummary.waitForRain}   sub="Rain expected"         color="#2471a3" />
          <StatCard icon="✅" label="Optimal"           value={irrigationSummary.optimal}       sub="No action needed"      color="#27AE60" />
          <StatCard icon="⚠️" label="Overwatered"      value={irrigationSummary.overwatered}   sub="Skip irrigation"       color="#e67e22" />
        </div>

        {/* Forecast Chart */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="m-0 mb-1.5 text-[16px] font-bold text-text-primary">
            7-Day Irrigation Demand vs Rainfall Forecast
          </h2>
          <p className="m-0 mb-5 text-[12px] text-text-muted">
            Water demand (litres) expected to drop on rainy days
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={irrigationForecastData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
              <YAxis tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
              <Tooltip
                formatter={(val, name) => [`${val.toLocaleString()} L`, name]}
                contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }}
              />
              <Legend />
              <Bar dataKey="demand" name="Demand (L)"   fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rain"   name="Rainfall (L)" fill="#2471a3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Crop Rules Reference */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="m-0 mb-4 text-[16px] font-bold text-text-primary">
            📋 Irrigation Rules by Crop
          </h2>
          <div className="overflow-x-auto w-full border border-border rounded-lg">
            <table className="w-full border-collapse text-left min-w-[540px]">
              <thead>
                <tr className="bg-sidebar text-white">
                  {["Crop", "Min Moisture", "Max Moisture", "Interval", "Water/Acre", "Best Time"].map(h => (
                    <th key={h} className="p-2.5 px-3.5 text-[12px] font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(cropIrrigationRules).map(([crop, r], i) => (
                  <tr key={crop} className={`${i % 2 === 0 ? "bg-table-stripe" : "bg-card"} border-b border-border/10 last:border-0 hover:bg-black/5 transition-colors`}>
                    <td className="p-2.5 px-3.5 text-[13px] font-bold text-text-primary">{crop}</td>
                    <td className="p-2.5 px-3.5 text-[13px] text-text-secondary">{r.minMoisture}%</td>
                    <td className="p-2.5 px-3.5 text-[13px] text-text-secondary">{r.maxMoisture}%</td>
                    <td className="p-2.5 px-3.5 text-[13px] text-text-secondary">{r.intervalDays} days</td>
                    <td className="p-2.5 px-3.5 text-[13px] text-text-secondary">{r.waterLitersPerAcre.toLocaleString()} L</td>
                    <td className="p-2.5 px-3.5 text-[12px] font-semibold text-[#4ade80]">{r.bestTimeWindow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-1.5 mb-6 bg-input rounded-xl p-1 w-fit overflow-x-auto max-w-full">
          {FILTERS.map(f => (
            <button 
              key={f} 
              className={`px-[18px] py-1.5 rounded-[10px] border-none cursor-pointer font-bold text-[13px] whitespace-nowrap transition-colors duration-200 ${filter === f ? "bg-accent/15 dark:bg-accent/20 text-accent shadow-sm" : "bg-transparent text-text-muted hover:text-text-primary"}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Advisory Cards */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {shown.map(a => {
            const ug = urgencyStyle[a.urgency] || urgencyStyle.None;
            return (
              <div 
                key={a.id} 
                className="bg-card rounded-xl p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5" 
                style={{ borderLeft: `6px solid ${ug.border}` }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-[15px] text-text-primary">
                      {a.farmer}
                    </div>
                    <div className="text-[12px] text-text-muted mt-0.5">
                      {a.location} · {a.crop}
                    </div>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    {a.urgency !== "None" && (
                      <span 
                        className="text-[10px] font-bold px-2 py-[3px] rounded-full"
                        style={{ background: ug.bg, color: ug.text }}
                      >
                        {a.urgency}
                      </span>
                    )}
                    {/* Voice Button */}
                    <button 
                      onClick={() => handleVoice(a)} 
                      title="Play voice advisory" 
                      className="w-7.5 h-7.5 border-none rounded-lg cursor-pointer text-[14px] flex items-center justify-center shrink-0 transition-colors"
                      style={{ background: speaking === a.id ? "#4ade80" : "var(--color-border)" }}
                    >
                      {speaking === a.id ? "⏹️" : "🔊"}
                    </button>
                  </div>
                </div>

                {/* Recommendation badge */}
                <div 
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] font-bold text-[14px] mb-3"
                  style={{ background: ug.bg, color: ug.text }}
                >
                  <span>{recIcon[a.recommendation] || "💡"}</span>
                  <span>{a.recommendation}</span>
                </div>

                {/* Moisture bar */}
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] text-text-muted">Soil Moisture</span>
                    <span className="text-[13px] font-extrabold" style={{ color: ug.text }}>{a.moisture}%</span>
                  </div>
                  <div className="h-2 bg-border rounded-md overflow-hidden">
                    <div className="h-full rounded-md transition-[width] duration-500 ease-out" style={{ width: `${a.moisture}%`, background: ug.text }} />
                  </div>
                </div>

                <p className="m-0 mb-2.5 text-[12px] text-text-muted leading-relaxed">{a.reason}</p>

                <div className="flex gap-2 flex-wrap">
                  <Chip label="⏰ Best Time" value={a.suggestedTime} />
                  {a.waterRequired !== "—" && <Chip label="💧 Water" value={a.waterRequired} />}
                  {a.rainExpected && <Chip label="🌧️ Rain in" value={a.nextRainIn} color="#2471a3" />}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

function Chip({ label, value, color }) {
  return (
    <div 
      className="bg-page border border-border rounded-lg px-2.5 py-1.5 text-[11px]"
      style={{ color: color || "var(--color-text-secondary)" }}
    >
      <span className="opacity-70">{label}: </span>
      <strong className="text-text-primary">{value}</strong>
    </div>
  );
}
