export default function StatCard({ icon, label, value, sub, color = "var(--text-primary)", bg }) {
  return (
    <div 
      className="rounded-[14px] px-6 py-5 border border-border flex flex-col gap-1.5 shadow-sm transition-colors duration-250 bg-card"
      style={{ ...(bg ? { background: bg } : {}) }}
    >
      <div className="text-[28px]">{icon}</div>
      <div className="text-[28px] font-extrabold leading-none" style={{ color }}>{value}</div>
      <div className="text-[13px] font-semibold text-text-secondary">{label}</div>
      {sub && <div className="text-[12px] text-text-muted">{sub}</div>}
    </div>
  );
}