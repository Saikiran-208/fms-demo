import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp, createProfile, cropOptions, soilOptions, telanganaDistricts, MOCK_OTP } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const PORTALS = { SELECT: "select", FARMERS: "farmers", ADMIN: "admin" };
const STEPS = { PHONE: "phone", OTP: "otp", PROFILE: "profile", DONE: "done" };

export default function Login() {
  const navigate = useNavigate();
  const { login, loginAsGuest, loginAsAdmin } = useAuth();
  
  const [portal, setPortal]     = useState(PORTALS.SELECT);
  const [step, setStep]         = useState(STEPS.PHONE);
  const [phone, setPhone]       = useState("");
  const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [profile, setProfile]   = useState({ name: "", village: "", block: "", district: "", soil: "Black", farmSize: "", crop: "Paddy" });
  const [adminCreds, setAdminCreds] = useState({ username: "", password: "" });

  const handleSelectPortal = (p) => { 
    setPortal(p); 
    setError(""); 
    setStep(STEPS.PHONE);
  };

  async function handleSendOtp(e) {
    e.preventDefault();
    if (phone.length !== 10) { setError("Enter a valid 10-digit mobile number"); return; }
    setError(""); setLoading(true);
    await sendOtp(phone);
    setLoading(false);
    setStep(STEPS.OTP);
  }

  function handleOtpChange(val, idx) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[idx] = val;
    setOtp(next);
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
    if (!val && idx > 0) document.getElementById(`otp-${idx - 1}`)?.focus();
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Enter the complete 6-digit OTP"); return; }
    setError(""); setLoading(true);
    try {
      const res = await verifyOtp(phone, code);
      setLoading(false);
      if (res.isNew) { setStep(STEPS.PROFILE); }
      else { login(res.farmer); navigate("/"); }
    } catch (err) { setLoading(false); setError(err.message); }
  }

  async function handleCreateProfile(e) {
    e.preventDefault();
    if (!profile.name || !profile.village || !profile.district) { setError("Fill all required fields"); return; }
    setError(""); setLoading(true);
    const res = await createProfile({ ...profile, phone });
    setLoading(false);
    login(res.farmer);
    navigate("/");
  }

  function handleAdminLogin(e) {
    e.preventDefault();
    if (adminCreds.username === "admin" && adminCreds.password === "admin123") {
      loginAsAdmin();
      navigate("/");
    } else {
      setError("Invalid administrative credentials");
    }
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4 transition-colors duration-250">
      <div className="w-full max-w-[420px] bg-card rounded-[20px] border border-border overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
        
        {/* Header */}
        <div className="bg-accent/10 dark:bg-accent/20 border-b border-accent/20 pt-8 px-8 pb-7 text-center">
          <div className="text-[40px] mb-2.5">🌿</div>
          <div className="text-[22px] font-extrabold text-[#4ade80]">FMS Portal</div>
          <div className="text-[12px] text-[#4a7a5a] mt-1 tracking-[1.5px]">
            {portal === PORTALS.ADMIN ? "OFFICER DASHBOARD" : "FARM MONITORING SYSTEM"}
          </div>
          <div className="text-[12px] text-[#4a7a5a] mt-0.5">Government of Telangana</div>
        </div>

        <div className="py-7 px-8">

          {/* ────── Selection ────── */}
          {portal === PORTALS.SELECT && (
            <div className="flex flex-col gap-4">
              <h2 className="m-0 mb-1 text-[18px] font-bold text-text-primary text-center">
                Select Portal
              </h2>
              <p className="m-0 mb-4 text-[13px] text-text-muted text-center">
                Access your specialized workspace
              </p>
              
              <button 
                onClick={() => handleSelectPortal(PORTALS.FARMERS)}
                className="w-full flex items-center gap-4 p-5 rounded-[18px] border-2 border-border bg-page text-left hover:border-accent hover:bg-accent/5 transition-all cursor-pointer group"
              >
                <div className="text-[28px] bg-accent/10 p-3 rounded-xl group-hover:bg-accent group-hover:text-white transition-all">👨‍🌾</div>
                <div>
                  <div className="font-bold text-text-primary text-[15px]">Farmer Portal</div>
                  <div className="text-[11px] text-text-muted">Crops, soil, and weather</div>
                </div>
              </button>

              <button 
                onClick={() => handleSelectPortal(PORTALS.ADMIN)}
                className="w-full flex items-center gap-4 p-5 rounded-[18px] border-2 border-border bg-page text-left hover:border-accent hover:bg-accent/5 transition-all cursor-pointer group"
              >
                <div className="text-[28px] bg-accent/10 p-3 rounded-xl group-hover:bg-accent group-hover:text-white transition-all">🛡️</div>
                <div>
                  <div className="font-bold text-text-primary text-[15px]">Officer Login</div>
                  <div className="text-[11px] text-text-muted">State-level monitoring</div>
                </div>
              </button>
            </div>
          )}

          {/* ── Farmer Step 1: Phone Number ── */}
          {portal === PORTALS.FARMERS && step === STEPS.PHONE && (
            <form onSubmit={handleSendOtp}>
              <button onClick={() => setPortal(PORTALS.SELECT)} className="bg-transparent border-none text-accent text-[12px] font-bold mb-4 cursor-pointer hover:underline p-0 uppercase tracking-widest">← Back</button>
              <h2 className="m-0 mb-1.5 text-[18px] font-bold text-text-primary">Farmer Login</h2>
              <p className="m-0 mb-6 text-[13px] text-text-muted">Enter mobile to continue</p>
              
              <label className="block text-[12px] font-semibold text-text-muted mb-1.5">Mobile Number</label>
              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-text-muted font-semibold">+91</span>
                <input
                  value={phone} onChange={e => setPhone(e.target.value.replace(/\D/, "").slice(0, 10))}
                  placeholder="9876543210"
                  className="w-full py-2.5 pr-3 pl-11 rounded-[10px] border border-border bg-input text-text-primary text-[14px] outline-none box-border focus:border-accent"
                />
              </div>
              {error && <ErrorMsg>{error}</ErrorMsg>}
              <button type="submit" disabled={loading} className="w-full p-3.5 bg-accent text-white border-none rounded-xl font-bold text-[15px] cursor-pointer hover:opacity-90">
                {loading ? "Sending..." : "Send OTP →"}
              </button>
              
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[12px] text-text-muted font-medium">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <button type="button" onClick={() => { loginAsGuest(); navigate("/"); }} className="w-full p-3.5 bg-transparent border border-border text-text-muted rounded-xl font-semibold text-[14px] cursor-pointer hover:border-accent hover:text-accent">
                👤 Continue as Guest
              </button>
            </form>
          )}

          {/* ── Farmer Step 2: OTP ── */}
          {portal === PORTALS.FARMERS && step === STEPS.OTP && (
            <form onSubmit={handleVerifyOtp}>
              <h2 className="m-0 mb-1.5 text-[18px] font-bold text-text-primary">Enter OTP</h2>
              <p className="m-0 mb-6 text-[13px] text-text-muted">Sent to +91 {phone}</p>
              <div className="flex gap-2.5 mb-5 justify-center">
                {otp.map((digit, i) => (
                  <input key={i} id={`otp-${i}`} value={digit} onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => e.key === "Backspace" && !digit && i > 0 && document.getElementById(`otp-${i - 1}`)?.focus()}
                    maxLength={1} className="w-[46px] h-[52px] text-center text-[22px] font-extrabold rounded-[10px] bg-input text-text-primary outline-none"
                    style={{ border: `2px solid ${digit ? "#4ade80" : "var(--color-border)"}` }}
                  />
                ))}
              </div>
              {error && <ErrorMsg>{error}</ErrorMsg>}
              <button type="submit" disabled={loading} className="w-full p-3.5 bg-accent text-white border-none rounded-xl font-bold text-[15px] cursor-pointer hover:opacity-90">
                {loading ? "Verifying..." : "Verify & Login →"}
              </button>
            </form>
          )}

          {/* ── Farmer Step 3: Profile ── */}
          {portal === PORTALS.FARMERS && step === STEPS.PROFILE && (
            <form onSubmit={handleCreateProfile}>
              <h2 className="m-0 mb-1.5 text-[18px] font-bold text-text-primary">Create Profile</h2>
              {[
                { label: "Full Name *", key: "name", placeholder: "e.g. Ravi Kumar" },
                { label: "Village *", key: "village", placeholder: "e.g. Pochampally" },
              ].map(f => (
                <div key={f.key} className="mb-3">
                  <label className="block text-[12px] font-semibold text-text-muted mb-1.5">{f.label}</label>
                  <input value={profile[f.key]} onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                    className="w-full p-2.5 px-3 rounded-[10px] border border-border bg-input text-text-primary text-[14px] outline-none focus:border-accent" />
                </div>
              ))}
              <div className="mb-3">
                <label className="block text-[12px] font-semibold text-text-muted mb-1.5">District *</label>
                <select value={profile.district} onChange={e => setProfile(p => ({ ...p, district: e.target.value }))}
                  className="w-full p-2.5 px-3 rounded-[10px] border border-border bg-input text-text-primary text-[14px] outline-none">
                  <option value="">Select district...</option>
                  {telanganaDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {error && <ErrorMsg>{error}</ErrorMsg>}
              <button type="submit" disabled={loading} className="w-full p-3.5 bg-accent text-white border-none rounded-xl font-bold text-[15px] cursor-pointer hover:opacity-90">
                {loading ? "Saving..." : "Complete →"}
              </button>
            </form>
          )}

          {/* ────── Admin Login ────── */}
          {portal === PORTALS.ADMIN && (
            <form onSubmit={handleAdminLogin}>
              <button onClick={() => setPortal(PORTALS.SELECT)} className="bg-transparent border-none text-accent text-[12px] font-bold mb-4 cursor-pointer hover:underline p-0 uppercase tracking-widest">← Back</button>
              <h2 className="m-0 mb-1.5 text-[18px] font-bold text-text-primary">Officer Login</h2>
              <p className="m-0 mb-6 text-[13px] text-text-muted">Authorized administrative access</p>
              
              <div className="mb-4">
                <label className="block text-[12px] font-semibold text-text-muted mb-1.5">Username</label>
                <input value={adminCreds.username} onChange={e => setAdminCreds(p => ({ ...p, username: e.target.value }))}
                  placeholder="admin" className="w-full p-2.5 px-3 rounded-[10px] border border-border bg-input text-text-primary text-[14px] outline-none focus:border-accent" />
              </div>
              <div className="mb-5">
                <label className="block text-[12px] font-semibold text-text-muted mb-1.5">Password</label>
                <input type="password" value={adminCreds.password} onChange={e => setAdminCreds(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••" className="w-full p-2.5 px-3 rounded-[10px] border border-border bg-input text-text-primary text-[14px] outline-none focus:border-accent" />
              </div>
              {error && <ErrorMsg>{error}</ErrorMsg>}
              <button type="submit" className="w-full p-3.5 bg-accent text-white border-none rounded-xl font-bold text-[15px] cursor-pointer hover:opacity-90">
                Access Dashboard →
              </button>
              <div className="mt-4 p-3 bg-page rounded-[10px] border border-border text-[11px] text-text-muted text-center">
                 Demo: <code className="text-accent bg-accent/10 px-1 rounded">admin</code> / <code className="text-accent bg-accent/10 px-1 rounded">admin123</code>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

function ErrorMsg({ children }) {
  return (
    <div className="bg-[#fdecea] text-[#c0392b] p-2.5 px-3.5 rounded-lg text-[13px] mb-3.5 border-l-4 border-l-[#c0392b]">
      {children}
    </div>
  );
}
