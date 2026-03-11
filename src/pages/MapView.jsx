import { useState } from "react";
import Navbar from "../components/Navbar";
import { farmersByDistrict } from "../api/farmerApi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const MAX_COUNT = Math.max(...farmersByDistrict.map(d => d.count));

function getColor(count) {
  if (!count) return "#2a5c3e";
  const t = count / MAX_COUNT;
  // dark green (#0f6632) to bright green (#a3f7b5)
  const r = Math.round(10 + t * (163 - 10));
  const g = Math.round(102 + t * (247 - 102));
  const b = Math.round(50 + t * (181 - 50));
  return `rgb(${r},${g},${b})`;
}

const sorted = [...farmersByDistrict].sort((a, b) => b.count - a.count);

export default function MapView() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="bg-page min-h-screen transition-colors duration-250 font-sans">
      <Navbar title="District Map View" />
      <div className="pt-6 px-4 md:px-7 pb-10">

        <div className="flex justify-between items-start mb-5 flex-wrap gap-3">
          <div>
            <h2 className="m-0 text-[20px] font-bold text-text-primary">
              🗺️ Telangana District Overview
            </h2>
            <p className="m-0 mt-1 text-[13px] text-text-muted">
              Farmer distribution across monitored districts · click a bar for details
            </p>
          </div>
          {/* Legend */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-text-muted font-semibold">Farmer Count Scale</span>
            <div className="flex gap-[3px]">
              {[0.1, 0.25, 0.45, 0.65, 0.85, 1].map(v => (
                <div key={v} className="w-7 h-4 rounded-[3px]" style={{ background: getColor(v * MAX_COUNT) }} />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-text-muted">
              <span>Low</span><span>High</span>
            </div>
          </div>
        </div>

        {/* Two column layout: chart + summary card */}
        <div className="flex gap-5 flex-wrap mb-6">

          {/* Bar Chart — acts as the "map" since actual map GeoJSON requires network  */}
          <div className="bg-card border border-border rounded-xl p-6 flex-[2] min-w-[300px] shadow-sm">
            <h3 className="m-0 mb-1 text-[16px] font-bold text-text-primary">
              Farmers by District
            </h3>
            <p className="m-0 mb-5 text-[12px] text-text-muted">
              Click a bar to see district details
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={sorted}
                margin={{ top: 0, right: 0, left: -20, bottom: 60 }}
                onClick={({ activePayload }) => activePayload && setSelected(activePayload[0]?.payload)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" />
                <XAxis dataKey="district" angle={-40} textAnchor="end" tick={{ fontSize: 11, fill: "var(--theme-text-muted)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--theme-text-muted)" }} />
                <Tooltip
                  contentStyle={{ background: "var(--theme-card)", border: "1px solid var(--theme-border)", borderRadius: 8, color: "var(--theme-text-primary)" }}
                  itemStyle={{ color: "var(--theme-text-primary)" }}
                  cursor={{ fill: "var(--theme-accent-hover)" }}
                />
                <Bar dataKey="count" name="Farmers" radius={[6, 6, 0, 0]} cursor="pointer">
                  {sorted.map(d => (
                    <Cell
                      key={d.district}
                      fill={selected?.district === d.district ? "#4ade80" : getColor(d.count)}
                      stroke={selected?.district === d.district ? "var(--theme-text-primary)" : "none"}
                      strokeWidth={2}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* District Detail / Selected Card */}
          <div className="flex-1 min-w-[220px] flex flex-col gap-4">

            {selected ? (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="text-[11px] text-text-muted font-bold mb-4 uppercase tracking-[0.5px]">
                  Selected District
                </div>
                <div className="text-[28px] font-extrabold text-[#4ade80] mb-1">
                  {selected.district}
                </div>
                <div className="text-[44px] font-black text-text-primary leading-none mb-2">
                  {selected.count}
                </div>
                <div className="text-[14px] text-text-muted mb-5">Registered Farmers</div>

                {/* Mini progress bar */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[12px] text-text-muted">vs. state max ({MAX_COUNT})</span>
                    <span className="text-[12px] font-bold text-[#4ade80]">
                      {Math.round((selected.count / MAX_COUNT) * 100)}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-border rounded-md overflow-hidden">
                    <div
                      className="h-full rounded-md transition-all duration-500 ease-in-out"
                      style={{
                        width: `${(selected.count / MAX_COUNT) * 100}%`,
                        background: getColor(selected.count),
                      }}
                    />
                  </div>
                </div>

                {/* Rank */}
                <div className="mt-5 p-3 bg-page rounded-[10px] border border-border">
                  <div className="text-[12px] text-text-muted">State Rank</div>
                  <div className="text-[24px] font-extrabold text-text-primary">
                    #{sorted.findIndex(d => d.district === selected.district) + 1}
                    <span className="text-[13px] text-text-muted font-normal"> of {sorted.length}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="mt-4 w-full p-2.5 bg-border text-text-secondary border-none rounded-lg cursor-pointer font-semibold text-[13px] hover:bg-black/5 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-6 text-center shadow-sm">
                <div className="text-[48px] mb-3">👆</div>
                <div className="text-[14px] font-semibold text-text-primary">Click a district bar</div>
                <div className="text-[12px] text-text-muted mt-1.5">to see detailed farmer count and ranking</div>
              </div>
            )}

            {/* Top 3 */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="m-0 mb-3 text-[14px] font-bold text-text-primary">
                🏆 Top Districts
              </h3>
              {sorted.slice(0, 5).map((d, i) => (
                <div
                  key={d.district}
                  onClick={() => setSelected(d)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer border mb-1.5 transition-colors duration-150 ${selected?.district === d.district ? "bg-accent/10 border-[#4ade80]" : "bg-page border-border hover:bg-black/5"}`}
                >
                  <span
                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0"
                    style={{
                      background: i < 3 ? "#4ade80" : "var(--color-border)",
                      color: i < 3 ? "#0f2d1f" : "var(--color-text-muted)"
                    }}
                  >{i + 1}</span>
                  <span className="flex-1 text-[13px] text-text-secondary font-medium">{d.district}</span>
                  <span className="text-[13px] font-bold" style={{ color: getColor(d.count) }}>{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full district ranking table */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="m-0 mb-4 text-[15px] font-bold text-text-primary">
            📋 All Districts — Full Ranking
          </h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5">
            {sorted.map((d, i) => (
              <div
                key={d.district}
                onClick={() => setSelected(d)}
                className={`p-3 px-3.5 rounded-[10px] cursor-pointer flex justify-between items-center transition-all duration-150 border ${selected?.district === d.district ? "bg-accent/10 border-[#4ade80]" : "bg-page border-border hover:bg-black/5"}`}
              >
                <div>
                  <div className="text-[11px] text-text-faint">#{i + 1}</div>
                  <div className="text-[13px] font-semibold text-text-primary">{d.district}</div>
                </div>
                <div className="text-right">
                  <div className="text-[18px] font-extrabold" style={{ color: getColor(d.count) }}>{d.count}</div>
                  <div className="h-1 w-[60px] bg-border rounded-sm mt-1 overflow-hidden">
                    <div className="h-full rounded-sm" style={{ width: `${(d.count / MAX_COUNT) * 100}%`, background: getColor(d.count) }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
