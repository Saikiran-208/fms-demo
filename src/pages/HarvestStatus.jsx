import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import { harvestData, harvestSummary } from "../api/farmerApi";
import { mockScanImage, cropScanTips, scanHistory } from "../api/harvestAiApi";
import { getHarvestColor, formatDate } from "../utils/helpers";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const pieData = [
  { name: "Ready",     value: 140, color: "#4ade80" },
  { name: "Not Ready", value: 80,  color: "#E74C3C" },
  { name: "Pending",   value: 20,  color: "#F4A300" },
];

const cropBreakdown = [
  { crop: "Paddy",   ready: 58, notReady: 20, pending: 8 },
  { crop: "Cotton",  ready: 30, notReady: 25, pending: 6 },
  { crop: "Maize",   ready: 28, notReady: 18, pending: 3 },
  { crop: "Soybean", ready: 16, notReady: 12, pending: 2 },
  { crop: "Wheat",   ready: 8,  notReady: 5,  pending: 1 },
];

const RANGES = ["7D", "30D", "90D"];
const TABS   = ["Overview", "Upload Scan", "Scan History"];
const CROPS  = ["Paddy", "Cotton", "Maize", "Wheat", "Soybean", "Groundnut"];

export default function HarvestStatus() {
  const [range, setRange]     = useState("7D");
  const [tab, setTab]         = useState("Overview");

  // Upload scan state
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview]     = useState(null);
  const [crop, setCrop]           = useState("Paddy");
  const [scanning, setScanning]   = useState(false);
  const [result, setResult]       = useState(null);
  const [drag, setDrag]           = useState(false);
  const fileRef = useRef();

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  }

  async function handleScan() {
    if (!selectedFile) return;
    setScanning(true);
    try {
      const res = await mockScanImage(selectedFile, crop);
      setResult(res);
    } finally {
      setScanning(false);
    }
  }

  function resetScan() { setSelectedFile(null); setPreview(null); setResult(null); }

  const resultStyle = result
    ? (result.result === "Ready"
        ? { bg: "#e6f4ea", text: "#27AE60", border: "#27AE60" }
        : { bg: "#fdecea", text: "#c0392b", border: "#c0392b" })
    : {};

  return (
    <div className="bg-page min-h-screen transition-colors duration-250 font-sans">
      <Navbar title="Harvest Status" />
      <div className="pt-6 px-4 md:px-7 pb-10">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard icon="📷" label="Total Scans"  value={harvestSummary.totalScans} sub="AI predictions done"   />
          <StatCard icon="✅" label="Ready"         value={harvestSummary.ready}      sub="Ready to harvest"     color="#27AE60" />
          <StatCard icon="❌" label="Not Ready"     value={harvestSummary.notReady}   sub="Needs more time"      color="#E74C3C" />
          <StatCard icon="⏳" label="Pending"       value={harvestSummary.pending}    sub="Awaiting scan"        color="#F4A300" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-border rounded-xl p-1 w-fit">
          {TABS.map(t => (
            <button 
              key={t} 
              onClick={() => setTab(t)} 
              className={`px-5 py-2 rounded-[10px] border-none cursor-pointer font-bold text-[13px] transition-colors duration-200 ${tab === t ? "bg-accent/15 dark:bg-accent/20 text-accent shadow-sm" : "bg-transparent text-text-muted hover:text-text-primary"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === "Overview" && (
          <>
            <div className="flex justify-end mb-4">
              <div className="flex bg-border rounded-[10px] p-0.5 gap-0.5">
                {RANGES.map(r => (
                  <button 
                    key={r} 
                    onClick={() => setRange(r)} 
                    className={`px-4.5 py-1.5 rounded-lg border-none cursor-pointer font-bold text-[13px] transition-colors duration-200 ${range === r ? "bg-accent/15 dark:bg-accent/20 text-accent" : "bg-transparent text-text-muted hover:text-text-primary"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-5 flex-wrap mb-6">
              <div className="bg-card border border-border rounded-xl p-6 flex-1 min-w-[260px] shadow-sm">
                <h2 className="m-0 mb-1 text-[16px] font-bold text-text-primary">Harvest Status Breakdown</h2>
                <p className="m-0 mb-4 text-[12px] text-text-muted">{harvestSummary.totalScans} total AI scans · {range}</p>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="45%" outerRadius={85} innerRadius={45} dataKey="value" label={false}>
                      {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                    <Legend formatter={(v, e) => <span className="text-[13px] text-text-secondary font-semibold">{v} — {e.payload.value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 flex-[2] min-w-[260px] shadow-sm">
                <h2 className="m-0 mb-5 text-[16px] font-bold text-text-primary">Crop Type Breakdown</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={cropBreakdown} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="crop" tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
                    <YAxis tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
                    <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                    <Legend />
                    <Bar dataKey="ready"    name="Ready"     fill="#4ade80" stackId="a" radius={[0,0,0,0]} />
                    <Bar dataKey="notReady" name="Not Ready" fill="#E74C3C" stackId="a" />
                    <Bar dataKey="pending"  name="Pending"   fill="#F4A300" stackId="a" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="m-0 mb-5 text-[16px] font-bold text-text-primary">Recent Scan History</h2>
              <div className="overflow-x-auto w-full border border-border rounded-lg">
                <table className="w-full border-collapse text-left min-w-[700px]">
                  <thead><tr className="bg-input border-b border-border">{["Farmer","Crop","Result","Confidence","Days Remaining","Date"].map(h => <th key={h} className="p-3.5 text-[12px] font-semibold text-text-secondary uppercase tracking-[0.5px] whitespace-nowrap">{h}</th>)}</tr></thead>
                  <tbody>
                    {harvestData.map((row, i) => {
                      const c = getHarvestColor(row.result);
                      return (
                        <tr key={row.id} className={`transition-colors duration-150 hover:bg-accent/5 ${i !== harvestData.length - 1 ? 'border-b border-border/50' : ''}`}>
                          <td className="p-3.5 text-[13px] font-semibold text-text-primary whitespace-nowrap">{row.farmer}</td>
                          <td className="p-3.5 text-[13px] text-text-secondary whitespace-nowrap">{row.crop}</td>
                          <td className="p-3.5 text-[13px] whitespace-nowrap"><span className="px-3 py-1 rounded-full text-[12px] font-bold inline-block" style={{ background: c.bg, color: c.text }}>{row.result}</span></td>
                          <td className="p-3.5 text-[13px] font-bold whitespace-nowrap">{row.confidence}%</td>
                          <td className="p-3.5 text-[13px] text-text-secondary whitespace-nowrap">{row.daysRemaining === 0 ? "—" : `${row.daysRemaining} days`}</td>
                          <td className="p-3.5 text-[13px] text-text-secondary whitespace-nowrap">{formatDate(row.date)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── UPLOAD SCAN TAB ── */}
        {tab === "Upload Scan" && (
          <div className="flex gap-6 flex-wrap">

            <div className="flex-[2] min-w-[280px] flex flex-col gap-4">
              {/* Crop selector */}
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <label className="text-[12px] font-semibold text-text-muted">Crop Type</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {CROPS.map(c => (
                    <button 
                      key={c} 
                      onClick={() => setCrop(c)} 
                      className={`px-4 py-[7px] rounded-full border border-border cursor-pointer font-semibold text-[13px] transition-colors duration-200 ${crop === c ? "bg-accent/10 dark:bg-accent/20 border-accent/30 text-accent" : "bg-border text-text-secondary hover:text-text-primary"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drop zone */}
              <div
                className={`bg-card rounded-2xl min-h-[280px] flex items-center justify-center relative overflow-hidden transition-colors duration-200 ${preview ? 'cursor-default' : 'cursor-pointer hover:bg-black/5'} ${drag ? 'border-2 border-dashed border-accent' : 'border-2 border-dashed border-border'}`}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => !preview && fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => handleFile(e.target.files[0])} />

                {preview ? (
                  <>
                    <img src={preview} alt="crop" className="w-full h-[280px] object-cover block" />
                    <button 
                      onClick={e => { e.stopPropagation(); resetScan(); }} 
                      className="absolute top-2.5 right-2.5 bg-black/60 border-none rounded-full w-7.5 h-7.5 text-white cursor-pointer text-[16px] flex items-center justify-center hover:bg-black/80 transition-colors"
                    >✕</button>
                  </>
                ) : (
                  <div className="text-center p-8">
                    <div className="text-[52px] mb-3">📷</div>
                    <div className="text-[16px] font-bold text-text-primary">Upload Crop Photo</div>
                    <div className="text-[13px] text-text-muted mt-1.5">Drag & drop or click to select</div>
                    <div className="text-[12px] text-text-faint mt-1">JPG, PNG, WEBP · max 10 MB</div>
                  </div>
                )}
              </div>

              <button 
                onClick={handleScan} 
                disabled={!selectedFile || scanning} 
                className={`p-3.5 border-none rounded-xl font-bold text-[15px] transition-colors duration-200 ${selectedFile && !scanning ? 'bg-accent text-white cursor-pointer hover:opacity-90' : 'bg-border text-text-faint cursor-not-allowed'}`}
              >
                {scanning
                  ? <span className="flex items-center justify-center gap-2">
                      <SpinnerSvg /> Analysing crop image...
                    </span>
                  : "🤖 Run AI Harvest Scan"}
              </button>

              {/* Result */}
              {result && (
                <div 
                  className="rounded-2xl p-6 border-2"
                  style={{ background: resultStyle.bg, borderColor: resultStyle.border }}
                >
                  <div className="font-extrabold text-[24px] mb-1" style={{ color: resultStyle.text }}>
                    {result.result === "Ready" ? "✅" : "⏳"} {result.result}
                  </div>
                  <div className="text-[14px] text-text-muted mb-3.5">
                    Confidence: <strong style={{ color: resultStyle.text }}>{result.confidence}%</strong>
                    {result.daysRemaining > 0 && <> · <strong className="text-text-primary">{result.daysRemaining} days remaining</strong></>}
                  </div>
                  <p className="m-0 text-[13px] text-text-secondary leading-relaxed">{result.advice}</p>
                </div>
              )}
            </div>

            {/* Tips sidebar */}
            <div className="bg-card border border-border rounded-xl p-6 flex-1 min-w-[240px] self-start shadow-sm">
              <h3 className="m-0 mb-3 text-[15px] font-bold text-text-primary">
                📌 {crop} — Photo Tips
              </h3>
              <p className="m-0 mb-4 text-[12px] text-text-muted">
                For best AI accuracy, ensure your photo shows:
              </p>
              <div className="flex flex-col gap-2.5">
                {(cropScanTips[crop] || cropScanTips.Paddy).map((tip, i) => (
                  <div key={i} className="flex gap-2.5 p-2.5 bg-page rounded-lg border border-border">
                    <span className="font-bold text-accent shrink-0">{i + 1}.</span>
                    <span className="text-[13px] text-text-secondary leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 text-[12px] text-text-faint leading-loose p-3 bg-page rounded-lg border border-border">
                💡 <strong className="text-text-secondary">How it works:</strong> Your image is analysed by our AI model trained on 50,000+ crop images. Results are returned in seconds.
              </div>
            </div>
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === "Scan History" && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="m-0 mb-5 text-[16px] font-bold text-text-primary">All Scan Records</h2>
            <div className="overflow-x-auto w-full border border-border rounded-lg">
              <table className="w-full border-collapse text-left min-w-[700px]">
                <thead><tr className="bg-input border-b border-border">{["Scan ID","Farmer","Crop","Result","Confidence","Days Rem.","Date"].map(h => <th key={h} className="p-3.5 text-[12px] font-semibold text-text-secondary uppercase tracking-[0.5px] whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {scanHistory.map((s, i) => {
                    const c = getHarvestColor(s.result);
                    return (
                      <tr key={s.id} className={`transition-colors duration-150 hover:bg-black/5 ${i !== scanHistory.length - 1 ? 'border-b border-border/50' : ''}`}>
                        <td className="p-3.5 text-[12px] text-text-faint font-mono whitespace-nowrap">{s.id}</td>
                        <td className="p-3.5 text-[13px] font-semibold text-text-primary whitespace-nowrap">{s.farmer}</td>
                        <td className="p-3.5 text-[13px] text-text-secondary whitespace-nowrap">{s.crop}</td>
                        <td className="p-3.5 text-[13px] whitespace-nowrap"><span className="px-2.5 py-1 rounded-full text-[12px] font-bold inline-block" style={{ background: c.bg, color: c.text }}>{s.result}</span></td>
                        <td className="p-3.5 text-[13px] font-bold whitespace-nowrap">{s.confidence}%</td>
                        <td className="p-3.5 text-[13px] text-text-secondary whitespace-nowrap">{s.daysRemaining === 0 ? "Ready now" : `${s.daysRemaining} days`}</td>
                        <td className="p-3.5 text-[13px] text-text-secondary whitespace-nowrap">{formatDate(s.date)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}



function SpinnerSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <circle cx="12" cy="12" r="10" stroke="#4ade80" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
    </svg>
  );
}