import { useState } from "react";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import FarmerDrawer from "../components/FarmerDrawer";
import { farmerData, farmersByDistrict, farmerSummary } from "../api/farmerApi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "../context/AppContext";

function exportCSV(data, filename) {
  const keys = Object.keys(data[0]);
  const rows = [keys.join(","), ...data.map(r => keys.map(k => `"${r[k]}"`).join(","))];
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function FarmerStats() {
  const { searchQuery } = useApp();
  const [localSearch, setLocalSearch] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const term = localSearch || searchQuery;
  const filtered = farmerData.filter(f =>
    f.name.toLowerCase().includes(term.toLowerCase()) ||
    f.district.toLowerCase().includes(term.toLowerCase()) ||
    f.crop.toLowerCase().includes(term.toLowerCase())
  );

  return (
    <div className="bg-page min-h-screen transition-colors duration-250 font-sans">
      <Navbar title="Farmer Statistics" />

      <div className="pt-6 px-4 md:px-7 pb-10">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard icon="👨‍🌾" label="Total Farmers"      value={farmerSummary.total}                        sub="All registered"         />
          <StatCard icon="✅" label="Active This Month"    value={farmerSummary.activeThisMonth}               sub="Used app this month"    color="#c47900" />
          <StatCard icon="🆕" label="New This Week"        value={farmerSummary.newThisWeek}                   sub="Recent registrations"   color="#7d3c98" />
          <StatCard icon="📏" label="Total Farm Area"      value={`${farmerSummary.totalArea} ac`}             sub="Under monitoring"       color="#2471a3" />
        </div>

        {/* Chart */}
        <div className="flex gap-5 flex-wrap mb-6">
          <div className="bg-card border border-border rounded-xl p-6 flex-1 min-w-[280px] shadow-sm">
            <h2 className="m-0 mb-5 text-[16px] font-bold text-text-primary">
              Farmers by District
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={farmersByDistrict} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="district" angle={-35} textAnchor="end" tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="count" fill="#4ade80" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Farmer Table */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
            <h2 className="m-0 text-[16px] font-bold text-text-primary">
              Farmer List <span className="text-text-muted font-normal text-[13px]">
                ({filtered.length} records)
              </span>
            </h2>
            <div className="flex gap-2.5 flex-wrap flex-1 justify-end">
              <input
                placeholder="Search by name, district, crop..."
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                className="px-3.5 py-2 rounded-lg border border-border bg-input text-text-primary text-[13px] outline-none min-w-[180px] flex-1 max-w-[280px] focus:border-accent"
              />
              <button
                onClick={() => exportCSV(farmerData, "farmers.csv")}
                className="px-4 py-2 bg-accent/10 dark:bg-accent/20 text-accent border border-accent/20 rounded-lg cursor-pointer font-semibold text-[13px] whitespace-nowrap hover:bg-accent/20 transition-colors"
              >⬇ Export CSV</button>
            </div>
          </div>
          <div className="overflow-x-auto w-full border border-border rounded-lg">
            <table className="w-full border-collapse text-left min-w-[700px]">
              <thead>
                <tr className="bg-input border-b border-border">
                  {["Name", "Village", "Block", "District", "Soil Type", "Farm Size", "Crop"].map(h => (
                    <th key={h} className="p-3.5 text-[12px] font-semibold text-text-secondary uppercase tracking-[0.5px] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((f, i) => (
                  <tr key={f.id}
                    onClick={() => setSelectedFarmer(f)}
                    className={`cursor-pointer transition-colors duration-150 hover:bg-accent/5 ${i !== filtered.length - 1 ? 'border-b border-border/50' : ''}`}
                  >
                    <td className="p-3.5 text-[13px] font-semibold text-text-primary whitespace-nowrap">{f.name}</td>
                    <td className="p-3.5 text-[13px] text-text-secondary whitespace-nowrap">{f.village}</td>
                    <td className="p-3.5 text-[13px] text-text-secondary whitespace-nowrap">{f.block}</td>
                    <td className="p-3.5 text-[13px] text-text-secondary whitespace-nowrap">{f.district}</td>
                    <td className="p-3.5 text-[13px] whitespace-nowrap">
                      <span className="bg-[#e6f4ea] text-[#27AE60] px-2.5 py-[3px] rounded-full text-[12px] font-bold inline-block">
                        {f.soil}
                      </span>
                    </td>
                    <td className="p-3.5 text-[13px] text-text-secondary whitespace-nowrap">{f.farmSize} ac</td>
                    <td className="p-3.5 text-[13px] font-semibold text-text-primary whitespace-nowrap">{f.crop}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <FarmerDrawer farmer={selectedFarmer} onClose={() => setSelectedFarmer(null)} />
    </div>
  );
}