import { useState } from "react";
import Navbar from "../components/Navbar";
import { marketPriceData, priceTrendData, marketSummary } from "../api/marketApi";
import { getTrendIcon } from "../utils/helpers";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const RANGES = ["7D", "30D", "90D"];

function exportCSV(data, filename) {
  const keys = Object.keys(data[0]);
  const rows = [keys.join(","), ...data.map(r => keys.map(k => `"${r[k]}"`).join(","))];
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function MarketPrices() {
  const [selectedCrop, setSelectedCrop] = useState("All");
  const [range, setRange] = useState("7D");
  const crops = ["All", "Paddy", "Maize", "Cotton", "Soybean", "Wheat"];

  const filtered = selectedCrop === "All"
    ? marketPriceData
    : marketPriceData.filter(d => d.crop === selectedCrop);

  return (
    <div className="bg-page min-h-screen transition-colors duration-250 font-sans">
      <Navbar title="Market Prices" />
      <div className="pt-6 px-4 md:px-7 pb-10">

        {/* Summary Cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-6">
          {marketSummary.map((item) => {
            const { icon, color } = getTrendIcon(item.trend);
            return (
              <div key={item.crop} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <div className="text-[13px] font-bold text-text-muted mb-1.5">{item.crop}</div>
                <div className="text-[26px] font-extrabold text-text-primary">₹{item.avgPrice}</div>
                <div className="text-[11px] text-text-faint mb-1.5">Avg / Quintal</div>
                <div className="text-[12px] text-text-secondary flex items-center">
                  Best: <strong className="ml-1">{item.highMandi}</strong><span className="mx-1">—</span>₹{item.highPrice}
                  <span className="ml-1.5 font-bold" style={{ color }}>{icon}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price Trend Chart */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
            <h2 className="m-0 text-[16px] font-bold text-text-primary">
              Price Trend (₹ per Quintal)
            </h2>
            {/* Range Tabs */}
            <div className="flex bg-border rounded-[10px] p-0.5 gap-0.5">
              {RANGES.map(r => (
                <button 
                  key={r} 
                  onClick={() => setRange(r)} 
                  className="px-4 py-1.5 rounded-lg border-none cursor-pointer font-semibold text-[12px] transition-all duration-200"
                  style={{
                    background: range === r ? "var(--color-accent-hover)" : "transparent",
                    color: range === r ? "var(--color-accent)" : "var(--color-text-muted)",
                  }}
                >{r}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={priceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
              <YAxis tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
              <Tooltip formatter={(val) => `₹${val}`} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Legend />
              <Line type="monotone" dataKey="Paddy"   stroke="#4ade80" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Maize"   stroke="#F4A300" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Cotton"  stroke="#9B59B6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Soybean" stroke="#27AE60" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Wheat"   stroke="#E74C3C" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Filter + Table */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2.5">
            <h2 className="m-0 text-[16px] font-bold text-text-primary">Mandi Prices</h2>
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex gap-1.5 bg-input rounded-xl p-1 overflow-x-auto m-0">
                {crops.map(crop => (
                  <button 
                    key={crop} 
                    className={`px-[18px] py-1.5 rounded-[10px] border-none cursor-pointer font-bold text-[13px] whitespace-nowrap transition-colors duration-200 ${selectedCrop === crop ? "bg-accent/15 dark:bg-accent/20 text-accent shadow-sm" : "bg-transparent text-text-muted hover:text-text-primary"}`}
                    onClick={() => setSelectedCrop(crop)}
                  >
                    {crop}
                  </button>
                ))}
              </div>
              <button
                onClick={() => exportCSV(marketPriceData, "market_prices.csv")}
                className="px-4 py-2 bg-accent/10 dark:bg-accent/20 text-accent border border-accent/20 rounded-lg cursor-pointer font-semibold text-[13px] whitespace-nowrap transition-colors duration-200 hover:bg-accent/20"
              >
                ⬇ Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto w-full border border-border rounded-lg">
            <table className="w-full border-collapse text-left min-w-[600px]">
              <thead>
                <tr className="bg-input border-b border-border">
                  {["Crop", "Mandi", "District", "Price (₹/Quintal)", "Previous", "Trend"].map(h => (
                    <th key={h} className="p-3.5 text-[12px] font-semibold text-text-secondary">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const { icon, color } = getTrendIcon(row.trend);
                  const diff = row.price - row.prevPrice;
                  return (
                    <tr key={row.id} className="border-b border-border/10 last:border-0 hover:bg-black/5 transition-colors">
                      <td className="p-3.5 font-bold text-text-primary">{row.crop}</td>
                      <td className="p-3.5 text-text-secondary">{row.mandi}</td>
                      <td className="p-3.5 text-text-secondary">{row.district}</td>
                      <td className="p-3.5 font-bold text-[14px] text-text-primary">₹{row.price}</td>
                      <td className="p-3.5 text-text-faint">₹{row.prevPrice}</td>
                      <td className="p-3.5 flex items-center">
                        <span className="font-bold text-[14px]" style={{ color }}>{icon}</span>
                        <span className="text-[12px] ml-1" style={{ color }}>
                          {diff > 0 ? `+₹${diff}` : diff < 0 ? `-₹${Math.abs(diff)}` : "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}