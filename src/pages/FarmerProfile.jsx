import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { cropOptions, soilOptions, telanganaDistricts } from "../api/authApi";

const SECTIONS = ["Personal", "Farm Details", "Crop & Soil", "Account"];

function F({ label, value, editKey, type = "text", options, editing, form, setForm }) {
  return (
    <div className="mb-4.5">
      <label className="block text-[12px] font-semibold text-text-muted mb-2">{label}</label>
      {editing ? (
        options ? (
          <select 
            value={form[editKey]} 
            onChange={e => setForm(f => ({ ...f, [editKey]: e.target.value }))}
            className="w-full p-2.5 px-3.5 rounded-[10px] border border-border bg-input text-text-primary text-[14px] outline-none box-border m-0 transition-colors focus:border-[#4ade80]"
          >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input 
            type={type} 
            value={form[editKey]}
            onChange={e => setForm(f => ({ ...f, [editKey]: e.target.value }))}
            className="w-full p-2.5 px-3.5 rounded-[10px] border border-border bg-input text-text-primary text-[14px] outline-none box-border m-0 transition-colors focus:border-[#4ade80]"
          />
        )
      ) : (
        <div className="p-2.5 px-3.5 bg-page rounded-[10px] border border-border text-[14px] text-text-primary font-medium">
          {value || <span className="text-text-faint">Not set</span>}
        </div>
      )}
    </div>
  );
}

export default function FarmerProfile() {
  const { currentFarmer, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState("Personal");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name:     currentFarmer?.name     || "",
    phone:    currentFarmer?.phone    || "",
    village:  currentFarmer?.village  || "",
    block:    currentFarmer?.block    || "",
    district: currentFarmer?.district || "",
    soil:     currentFarmer?.soil     || "Black",
    farmSize: currentFarmer?.farmSize || "",
    crop:     currentFarmer?.crop     || "Paddy",
    language: currentFarmer?.language || "en",
  });

  const initials = (form.name || "F")
    .split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleSave() {
    updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="bg-page min-h-screen transition-colors duration-250 font-sans">
      <Navbar title="My Profile" />
      <div className="pt-6 px-4 md:px-7 pb-10 max-w-[1000px] mx-auto">
        <div className="flex gap-6 flex-wrap">

          {/* Left: Avatar card */}
          <div className="w-[260px] shrink-0">
            <div className="bg-card border border-border rounded-xl p-7 text-center mb-4 shadow-sm">
              <div className="w-20 h-20 rounded-full bg-accent/10 dark:bg-accent/20 text-accent flex items-center justify-center text-[28px] font-extrabold mx-auto mb-3.5 border-3 border-accent">
                {initials}
              </div>
              <div className="text-[18px] font-extrabold text-text-primary mb-1">
                {form.name || "Farmer"}
              </div>
              <div className="text-[12px] text-text-muted">{form.phone ? `+91 ${form.phone}` : "No phone set"}</div>
              <div className="text-[12px] text-text-muted mt-0.5">{form.district || "Telangana"}</div>

              {saved && (
                <div className="mt-3 bg-[#e6f4ea] text-[#27AE60] p-2 rounded-lg text-[12px] font-bold">
                  ✅ Profile saved
                </div>
              )}

              {/* Edit/Save buttons */}
              {editing ? (
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={handleSave} 
                    className="flex-1 p-2.5 bg-accent/10 dark:bg-accent/20 text-accent border border-accent/20 rounded-[10px] font-bold cursor-pointer text-[13px] hover:opacity-90 transition-opacity"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setEditing(false)} 
                    className="flex-1 p-2.5 bg-border text-text-secondary border-none rounded-[10px] font-bold cursor-pointer text-[13px] hover:bg-black/5 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setEditing(true)} 
                  className="mt-4 w-full p-2.5 bg-border text-text-primary border-none rounded-[10px] font-bold cursor-pointer text-[13px] hover:bg-black/5 transition-colors"
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {/* Quick stats */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="text-[13px] font-bold text-text-primary mb-3">Farm Summary</div>
              {[
                { icon: "🌾", label: "Crop",      val: form.crop     || "—" },
                { icon: "📏", label: "Farm Size",  val: form.farmSize ? `${form.farmSize} acres` : "—" },
                { icon: "🪨", label: "Soil Type",  val: form.soil     || "—" },
                { icon: "🏘️", label: "Village",    val: form.village  || "—" },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <span className="text-[13px] text-text-muted">{r.icon} {r.label}</span>
                  <span className="text-[13px] font-semibold text-text-primary">{r.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Section tabs + form */}
          <div className="flex-1 min-w-[280px]">
            {/* Section tabs */}
            <div className="flex gap-1 mb-5 bg-border rounded-xl p-1 w-fit flex-wrap">
              {SECTIONS.map(s => (
                <button 
                  key={s} 
                  onClick={() => setSection(s)} 
                  className={`px-4.5 py-2 rounded-[10px] border-none cursor-pointer font-bold text-[13px] transition-colors duration-200 ${section === s ? "bg-accent/10 dark:bg-accent/20 text-accent" : "bg-transparent text-text-muted hover:text-text-primary"}`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="bg-card border border-border rounded-xl p-7 shadow-sm">
              {section === "Personal" && (
                <>
                  <h3 className="m-0 mb-5 text-[16px] font-bold text-text-primary">👤 Personal Information</h3>
                  <F editing={editing} form={form} setForm={setForm} label="Full Name"     value={form.name}    editKey="name"    />
                  <F editing={editing} form={form} setForm={setForm} label="Mobile Number" value={form.phone}   editKey="phone"   type="tel" />
                  <F editing={editing} form={form} setForm={setForm} label="Village"       value={form.village} editKey="village" />
                  <F editing={editing} form={form} setForm={setForm} label="Block / Mandal" value={form.block}  editKey="block"   />
                  <F editing={editing} form={form} setForm={setForm} label="District" value={form.district} editKey="district" options={telanganaDistricts} />
                </>
              )}

              {section === "Farm Details" && (
                <>
                  <h3 className="m-0 mb-5 text-[16px] font-bold text-text-primary">🌾 Farm Details</h3>
                  <F editing={editing} form={form} setForm={setForm} label="Farm Size (acres)" value={form.farmSize} editKey="farmSize" type="number" />
                  <F editing={editing} form={form} setForm={setForm} label="Primary Crop"      value={form.crop}     editKey="crop"     options={cropOptions} />
                  <F editing={editing} form={form} setForm={setForm} label="Soil Type"         value={form.soil}     editKey="soil"     options={soilOptions} />
                </>
              )}

              {section === "Crop & Soil" && (
                <>
                  <h3 className="m-0 mb-5 text-[16px] font-bold text-text-primary">🪨 Crop & Soil Details</h3>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
                    {[
                      { label: "Primary Crop",  val: form.crop,     icon: "🌾" },
                      { label: "Soil Type",     val: form.soil,     icon: "🪨" },
                      { label: "Farm Size",     val: `${form.farmSize || 0} acres`, icon: "📏" },
                      { label: "District",      val: form.district, icon: "📍" },
                    ].map(item => (
                      <div 
                        key={item.label} 
                        className="p-4 bg-page rounded-xl border border-border text-center"
                      >
                        <div className="text-[28px] mb-2">{item.icon}</div>
                        <div className="text-[11px] text-text-muted mb-1">{item.label}</div>
                        <div className="text-[15px] font-bold text-text-primary">{item.val || "—"}</div>
                      </div>
                    ))}
                  </div>

                  {/* Irrigation recommendation based on crop */}
                  <div className="mt-5 p-4 bg-[#e6f4ea] rounded-xl border border-[#4ade80]">
                    <div className="font-bold text-[#0f2d1f] mb-2">💧 Irrigation Guidance for {form.crop}</div>
                    <div className="text-[13px] text-[#2d5a3d] leading-relaxed">
                      {form.crop === "Paddy"    && "Paddy requires 70–90% soil moisture. Irrigate every 3 days between 6–8 AM."}
                      {form.crop === "Cotton"   && "Cotton requires 45–75% moisture. Irrigate every 5 days."}
                      {form.crop === "Maize"    && "Maize requires 50–80% moisture. Irrigate every 4 days."}
                      {form.crop === "Wheat"    && "Wheat requires 40–70% moisture. Irrigate every 6 days."}
                      {form.crop === "Soybean"  && "Soybean requires 50–75% moisture. Irrigate every 5 days."}
                      {!["Paddy","Cotton","Maize","Wheat","Soybean"].includes(form.crop) && "Follow district irrigation schedule. Maintain 50–75% optimal moisture range."}
                    </div>
                  </div>
                </>
              )}

              {section === "Account" && (
                <>
                  <h3 className="m-0 mb-5 text-[16px] font-bold text-text-primary">⚙️ Account Settings</h3>
                  <div className="mb-5">
                    <label className="block text-[12px] font-semibold text-text-muted mb-2">Preferred Language</label>
                    {editing ? (
                      <select 
                        value={form.language} 
                        onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                        className="w-full p-2.5 px-3.5 rounded-[10px] border border-border bg-input text-text-primary text-[14px] outline-none box-border m-0 transition-colors focus:border-[#4ade80]"
                      >
                        <option value="en">English</option>
                        <option value="te">తెలుగు (Telugu)</option>
                        <option value="hi">हिंदी (Hindi)</option>
                      </select>
                    ) : (
                      <div className="p-2.5 px-3.5 bg-page rounded-[10px] border border-border text-[14px] text-text-primary font-medium">
                        {form.language === "te" ? "తెలుగు (Telugu)" : form.language === "hi" ? "हिंदी (Hindi)" : "English"}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-page rounded-xl border border-border mb-5">
                    <div className="font-bold text-text-primary mb-3">🔐 Account Info</div>
                    {[
                      { label: "Registered Number", val: form.phone ? `+91 ${form.phone}` : "Not set" },
                      { label: "Farmer ID",          val: currentFarmer?.id ? `FMS-${currentFarmer.id}` : "FMS-AUTO" },
                      { label: "Member Since",       val: "March 2026" },
                      { label: "Account Status",     val: "✅ Active & Verified" },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between py-2 border-b border-border last:border-0 text-[13px]">
                        <span className="text-text-muted">{r.label}</span>
                        <span className="font-semibold text-text-primary">{r.val}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={handleLogout} 
                    className="w-full p-3.5 bg-[#fdecea] text-[#c0392b] border border-[#c0392b] rounded-xl font-bold text-[14px] cursor-pointer hover:bg-[#fadbd8] transition-colors"
                  >
                    🚪 Logout from FMS Portal
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
