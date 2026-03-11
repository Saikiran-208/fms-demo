import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

const ALL_DISTRICTS = [
  "Rangareddy", "Warangal", "Karimnagar", "Nizamabad",
  "Nalgonda", "Khammam", "Adilabad", "Medak", "Mahbubnagar", "Siddipet",
];

function Toggle({ on, onToggle }) {
  return (
    <button 
      className={`relative w-11 h-6 rounded-full border-none cursor-pointer transition-colors duration-200 ${on ? "bg-accent" : "bg-border"} after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-transform after:duration-200 ${on ? "after:translate-x-5" : ""}`} 
      onClick={onToggle} 
    />
  );
}

export default function Settings() {
  const { dark, toggleTheme } = useTheme();
  const {
    jurisdiction, setJurisdiction,
    language, setLanguage,
    notifPrefs, setNotifPrefs,
  } = useApp();

  function toggleDistrict(d) {
    if (d === "All") { setJurisdiction(["All"]); return; }
    const next = jurisdiction.includes("All") ? [d] :
      jurisdiction.includes(d) ? jurisdiction.filter(x => x !== d) : [...jurisdiction, d];
    setJurisdiction(next.length === 0 ? ["All"] : next);
  }

  function togglePref(key) {
    setNotifPrefs(p => ({ ...p, [key]: !p[key] }));
  }

  return (
    <div className="bg-page min-h-screen transition-colors duration-250 font-sans">
      <Navbar title="Settings" />
      <div className="pt-6 px-4 md:px-7 pb-10 max-w-[760px] mx-auto">

        {/* Profile */}
        <Section title="👤 Officer Profile">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-accent/15 dark:bg-accent/20 text-accent border border-accent/20 flex items-center justify-center font-extrabold text-[26px]">
              G
            </div>
            <div>
              <div className="text-[18px] font-bold text-text-primary">Govt. Officer</div>
              <div className="text-[13px] text-text-muted">Telangana Agriculture Portal</div>
              <div className="text-[12px] text-text-faint mt-0.5">officer@telangana.gov.in</div>
            </div>
          </div>
          <Row label="Employee ID"  value="TS/AGR/2024/1187" />
          <Row label="Role"         value="Senior Agriculture Officer" />
          <Row label="Department"   value="Department of Agriculture, Telangana" />
        </Section>

        {/* Appearance */}
        <Section title="🎨 Appearance">
          <RowToggle label="Dark Mode" sub="Switch to dark theme" on={dark} onToggle={toggleTheme} />
          <SettingRow label="Language" sub="Interface language">
            <div className="flex gap-2">
              {[{ code: "en", label: "English" }, { code: "te", label: "తెలుగు" }].map(l => (
                <button 
                  key={l.code} 
                  onClick={() => setLanguage(l.code)} 
                  className={`px-4 py-1.5 rounded-lg border-none cursor-pointer font-semibold text-[13px] transition-colors duration-200 ${language === l.code ? "bg-accent/15 dark:bg-accent/20 text-accent" : "bg-border text-text-secondary"} `}
                >{l.label}</button>
              ))}
            </div>
          </SettingRow>
        </Section>

        {/* Jurisdiction */}
        <Section title="📌 Jurisdiction Filter">
          <p className="m-0 mb-3 text-[13px] text-text-muted">
            Select districts you oversee. Choose "All" to monitor the entire state.
          </p>
          <div className="flex flex-wrap gap-2">
            {["All", ...ALL_DISTRICTS].map(d => {
              const active = jurisdiction.includes(d) || (d === "All" && jurisdiction.includes("All"));
              return (
                <button 
                  key={d} 
                  onClick={() => toggleDistrict(d)} 
                  className={`px-4 py-1.5 rounded-full border-none cursor-pointer font-semibold text-[13px] transition-colors duration-200 ${active ? "bg-accent/15 dark:bg-accent/20 text-accent" : "bg-border text-text-secondary"} `}
                >{d}</button>
              );
            })}
          </div>
        </Section>

        {/* Notifications */}
        <Section title="🔔 Notification Preferences">
          <RowToggle label="High Priority Alerts"  sub="Sensor failures, critical moisture"           on={notifPrefs.highAlerts}   onToggle={() => togglePref("highAlerts")} />
          <RowToggle label="Medium Alerts"          sub="Weather warnings, irrigation reminders"       on={notifPrefs.mediumAlerts} onToggle={() => togglePref("mediumAlerts")} />
          <RowToggle label="Price Changes"          sub="Mandi price updates above ₹50/quintal"        on={notifPrefs.priceChanges} onToggle={() => togglePref("priceChanges")} />
          <RowToggle label="Harvest Ready Alerts"   sub="Crops marked ready by AI scan"               on={notifPrefs.harvestReady} onToggle={() => togglePref("harvestReady")} />
        </Section>

        {/* App Info */}
        <Section title="ℹ️ About">
          <Row label="App Version"    value="v1.2.0" />
          <Row label="Data Updated"   value={new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} />
          <Row label="Portal"         value="Telangana Farm Monitoring System" />
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-5 shadow-sm">
      <h2 className="m-0 mb-4 text-[15px] font-bold text-text-primary">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-t border-border">
      <span className="text-[13px] text-text-muted">{label}</span>
      <span className="text-[13px] font-semibold text-text-primary">{value}</span>
    </div>
  );
}

function RowToggle({ label, sub, on, onToggle }) {
  return (
    <div className="flex justify-between items-center py-3 border-t border-border gap-3">
      <div>
        <div className="text-[13px] font-semibold text-text-primary">{label}</div>
        {sub && <div className="text-[11px] text-text-muted mt-0.5">{sub}</div>}
      </div>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  );
}

function SettingRow({ label, sub, children }) {
  return (
    <div className="flex justify-between items-center py-3 border-t border-border gap-3 flex-wrap">
      <div>
        <div className="text-[13px] font-semibold text-text-primary">{label}</div>
        {sub && <div className="text-[11px] text-text-muted mt-0.5">{sub}</div>}
      </div>
      {children}
    </div>
  );
}
