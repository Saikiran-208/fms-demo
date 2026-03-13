import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp, createProfile, cropOptions, soilOptions, telanganaDistricts, MOCK_OTP } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const STEPS = { PHONE: "phone", OTP: "otp", PROFILE: "profile", DONE: "done" };

export default function Login() {
  const navigate = useNavigate();
  const { login, loginAsGuest } = useAuth();
  const [step, setStep]           = useState(STEPS.PHONE);
  const [phone, setPhone]         = useState("");
  const [otp, setOtp]             = useState(["", "", "", "", "", ""]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [profile, setProfile]     = useState({ name: "", village: "", block: "", district: "", soil: "Black", farmSize: "", crop: "Paddy" });

  /* ── OTP input refs ── */

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

  function handleGuestLogin() {
    loginAsGuest();
    navigate("/");
  }


  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4 transition-colors duration-250">
      <div className="w-full max-w-[420px] bg-card rounded-[20px] border border-border overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
        {/* Header */}
        <div className="bg-accent/10 dark:bg-accent/20 border-b border-accent/20 pt-8 px-8 pb-7 text-center">
          <div className="text-[40px] mb-2.5">🌿</div>
          <div className="text-[22px] font-extrabold text-[#4ade80]">FMS Portal</div>
          <div className="text-[12px] text-[#4a7a5a] mt-1 tracking-[1.5px]">
            FARM MONITORING SYSTEM
          </div>
          <div className="text-[12px] text-[#4a7a5a] mt-0.5">Government of Telangana</div>
        </div>

        <div className="py-7 px-8">

          {/* ── Step 1: Phone Number ── */}
          {step === STEPS.PHONE && (
            <form onSubmit={handleSendOtp}>
              <h2 className="m-0 mb-1.5 text-[18px] font-bold text-text-primary">
                Welcome
              </h2>
              <p className="m-0 mb-6 text-[13px] text-text-muted">
                Enter your registered mobile number to continue
              </p>
              <label className="block text-[12px] font-semibold text-text-muted mb-1.5">Mobile Number</label>
              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-text-muted font-semibold">
                  +91
                </span>
                <input
                  value={phone} onChange={e => setPhone(e.target.value.replace(/\D/, "").slice(0, 10))}
                  placeholder="9876543210"
                  className="w-full py-2.5 pr-3 pl-11 rounded-[10px] border border-border bg-input text-text-primary text-[14px] outline-none box-border transition-colors duration-200 focus:border-[#4ade80]"
                  inputMode="numeric"
                />
              </div>
              {error && <ErrorMsg>{error}</ErrorMsg>}
              <button 
                type="submit" 
                className="w-full p-3.5 bg-accent text-white border-none rounded-xl font-bold text-[15px] cursor-pointer transition-opacity duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP →"}
              </button>

              {/* ── Divider ── */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[12px] text-text-muted font-medium">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* ── Guest Button ── */}
              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full p-3.5 bg-transparent border border-border text-text-muted rounded-xl font-semibold text-[14px] cursor-pointer transition-all duration-200 hover:border-accent hover:text-accent"
              >
                👤 Continue as Guest
              </button>

              <div className="mt-4 p-3 bg-page rounded-[10px] border border-border">
                <div className="text-[11px] text-text-muted leading-relaxed">
                  💡 <strong>Demo:</strong> Use any of these numbers: <br />
                  <code className="text-accent bg-accent/20 px-1 rounded">9876543210</code> — <code className="text-accent bg-accent/20 px-1 rounded">9876543211</code><br />
                  OTP will be: <code className="text-accent bg-accent/20 px-1 rounded">{MOCK_OTP}</code>
                </div>
              </div>
            </form>
          )}

          {/* ── Step 2: OTP Verification ── */}
          {step === STEPS.OTP && (
            <form onSubmit={handleVerifyOtp}>
              <h2 className="m-0 mb-1.5 text-[18px] font-bold text-text-primary">
                Enter OTP
              </h2>
              <p className="m-0 mb-6 text-[13px] text-text-muted">
                OTP sent to +91 {phone}
                <button 
                  type="button" 
                  onClick={() => { setStep(STEPS.PHONE); setOtp(["","","","","",""]); setError(""); }}
                  className="bg-transparent border-none text-[#4ade80] cursor-pointer text-[13px] ml-2 p-0 hover:underline"
                >
                  Change
                </button>
              </p>

              {/* 6 OTP boxes */}
              <div className="flex gap-2.5 mb-5 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => e.key === "Backspace" && !digit && i > 0 && document.getElementById(`otp-${i - 1}`)?.focus()}
                    maxLength={1}
                    inputMode="numeric"
                    className="w-[46px] h-[52px] text-center text-[22px] font-extrabold rounded-[10px] bg-input text-text-primary outline-none transition-colors duration-200"
                    style={{ border: `2px solid ${digit ? "#4ade80" : "var(--color-border)"}` }}
                  />
                ))}
              </div>
              {error && <ErrorMsg>{error}</ErrorMsg>}
              <button 
                type="submit" 
                className="w-full p-3.5 bg-accent text-white border-none rounded-xl font-bold text-[15px] cursor-pointer transition-opacity duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify & Login →"}
              </button>
              <p className="m-0 mt-3 text-center text-[13px] text-text-muted">
                Didn't receive? {" "}
                <button 
                  type="button" 
                  onClick={() => { setOtp(["","","","","",""]); setError(""); }}
                  className="bg-transparent border-none text-[#4ade80] cursor-pointer text-[13px] p-0 hover:underline"
                >
                  Resend OTP
                </button>
              </p>
            </form>
          )}

          {/* ── Step 3: New Farmer Profile ── */}
          {step === STEPS.PROFILE && (
            <form onSubmit={handleCreateProfile}>
              <h2 className="m-0 mb-1.5 text-[18px] font-bold text-text-primary">
                Create Profile
              </h2>
              <p className="m-0 mb-5 text-[13px] text-text-muted">
                New number detected. Complete your farmer profile.
              </p>

              {[
                { label: "Full Name *", key: "name",    placeholder: "e.g. Ravi Kumar"   },
                { label: "Village *",   key: "village", placeholder: "e.g. Pochampally"  },
                { label: "Block",       key: "block",   placeholder: "e.g. Bhongir"      },
              ].map(f => (
                <div key={f.key} className="mb-3">
                  <label className="block text-[12px] font-semibold text-text-muted mb-1.5">{f.label}</label>
                  <input
                    value={profile[f.key]}
                    onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full p-2.5 px-3 rounded-[10px] border border-border bg-input text-text-primary text-[14px] outline-none box-border transition-colors duration-200 focus:border-[#4ade80]"
                  />
                </div>
              ))}

              {/* District dropdown */}
              <div className="mb-3">
                <label className="block text-[12px] font-semibold text-text-muted mb-1.5">District *</label>
                <select 
                  value={profile.district} 
                  onChange={e => setProfile(p => ({ ...p, district: e.target.value }))}
                  className="w-full p-2.5 px-3 rounded-[10px] border border-border bg-input text-text-primary text-[14px] outline-none box-border transition-colors duration-200 focus:border-[#4ade80]"
                >
                  <option value="">Select district...</option>
                  {telanganaDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Soil + Farm Size row */}
              <div className="flex gap-2.5 mb-3">
                <div className="flex-1">
                  <label className="block text-[12px] font-semibold text-text-muted mb-1.5">Soil Type</label>
                  <select 
                    value={profile.soil} 
                    onChange={e => setProfile(p => ({ ...p, soil: e.target.value }))}
                    className="w-full p-2.5 px-3 rounded-[10px] border border-border bg-input text-text-primary text-[14px] outline-none box-border transition-colors duration-200 focus:border-[#4ade80]"
                  >
                    {soilOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-[12px] font-semibold text-text-muted mb-1.5">Farm Size (ac)</label>
                  <input 
                    type="number" 
                    min="0.1" 
                    step="0.1" 
                    value={profile.farmSize}
                    onChange={e => setProfile(p => ({ ...p, farmSize: e.target.value }))}
                    placeholder="e.g. 3.5" 
                    className="w-full p-2.5 px-3 rounded-[10px] border border-border bg-input text-text-primary text-[14px] outline-none box-border transition-colors duration-200 focus:border-[#4ade80]" 
                  />
                </div>
              </div>

              {/* Crop */}
              <div className="mb-5">
                <label className="block text-[12px] font-semibold text-text-muted mb-1.5">Primary Crop</label>
                <select 
                  value={profile.crop} 
                  onChange={e => setProfile(p => ({ ...p, crop: e.target.value }))}
                  className="w-full p-2.5 px-3 rounded-[10px] border border-border bg-input text-text-primary text-[14px] outline-none box-border transition-colors duration-200 focus:border-[#4ade80]"
                >
                  {cropOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {error && <ErrorMsg>{error}</ErrorMsg>}
              <button 
                type="submit" 
                className="w-full p-3.5 bg-accent text-white border-none rounded-xl font-bold text-[15px] cursor-pointer transition-opacity duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading}
              >
                {loading ? "Saving..." : "Complete Registration →"}
              </button>
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
