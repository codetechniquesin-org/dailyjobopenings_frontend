import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VITE_API_BASE_URL  from "../../config/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await axios.post(`${VITE_API_BASE_URL}/api/admin/login`, { email, password });
localStorage.setItem(
  "adminInfo",
  JSON.stringify({
    ...res.data.admin,
    token: res.data.token,
  })
);
console.log("Admin info stored in localStorage:", JSON.parse(localStorage.getItem("adminInfo")));
      navigate(res.data.admin.isTempPassword ? "/admin/reset-password" : "/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width:"100%", minHeight:"100vh", display:"flex", fontFamily:"'DM Sans',Arial,sans-serif", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body, #root { width:100%!important; min-height:100vh; margin:0!important; padding:0!important; overflow-x:hidden!important; }
        input { font-family:'DM Sans',Arial,sans-serif; }
        input:focus { outline:none; border-color:#0f4c81!important; box-shadow:0 0 0 3px rgba(15,76,129,0.1)!important; }
        .field input { width:100%; padding:12px 14px; font-size:14px; border:1.5px solid #e2e8f0; border-radius:10px; background:#f8fafc; color:#1a1a2e; transition:all .18s; }
        .pwd-wrap input { padding-right:46px; }
        .eye-btn { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; font-size:17px; color:#6b7280; padding:0; line-height:1; }
        .submit-btn { width:100%; padding:13px; border:none; border-radius:11px; background:linear-gradient(135deg,#0f4c81,#1565c0); color:#fff; font-weight:700; font-size:15px; font-family:'DM Sans',Arial,sans-serif; cursor:pointer; transition:all .22s; letter-spacing:.02em; }
        .submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 28px rgba(15,76,129,.32); }
        .submit-btn:disabled { opacity:.6; cursor:not-allowed; }
        .forgot { font-size:13px; color:#0f4c81; font-weight:600; text-decoration:none; }
        .forgot:hover { text-decoration:underline; }
        /* hide left panel on mobile */
        @media(max-width:767px) { .left-panel { display:none!important; } .right-panel { width:100%!important; } }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div className="left-panel" style={{
        flex:1, background:"linear-gradient(145deg,#0f4c81 0%,#1565c0 50%,#0d47a1 100%)",
        display:"flex", flexDirection:"column", justifyContent:"space-between",
        padding:"48px 44px", position:"relative", overflow:"hidden", minHeight:"100vh",
      }}>
        {/* Decorative circles */}
        <div style={{ position:"absolute", top:-80, right:-80, width:300, height:300, borderRadius:"50%", background:"rgba(255,255,255,.05)" }}/>
        <div style={{ position:"absolute", bottom:-60, left:-60, width:240, height:240, borderRadius:"50%", background:"rgba(255,255,255,.04)" }}/>
        <div style={{ position:"absolute", top:"40%", right:-40, width:160, height:160, borderRadius:"50%", border:"1px solid rgba(255,255,255,.08)" }}/>

        {/* Brand */}
        <div style={{ position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:60 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⚡</div>
            <span style={{ color:"#fff", fontWeight:800, fontSize:18, letterSpacing:".02em" }}>CodeTechniques</span>
          </div>
          <h2 style={{ color:"#fff", fontWeight:800, fontSize:"clamp(26px,3vw,38px)", lineHeight:1.2, marginBottom:16 }}>
            Welcome back,<br/>Admin 👋
          </h2>
          <p style={{ color:"rgba(255,255,255,.65)", fontSize:14.5, lineHeight:1.75, maxWidth:320 }}>
            Manage job listings, companies, applications and site content — all from one place.
          </p>
        </div>

        {/* Stats */}
        <div style={{ position:"relative", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[["12,400+","Active Listings"],["850+","Companies"],["2.3L+","Freshers Hired"],["98%","Satisfaction"]].map(([v,l]) => (
            <div key={l} style={{ background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.12)", borderRadius:12, padding:"14px 16px" }}>
              <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{v}</div>
              <div style={{ color:"rgba(255,255,255,.6)", fontSize:11.5, marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>

        <p style={{ position:"relative", color:"rgba(255,255,255,.35)", fontSize:12 }}>© 2025 CodeTechniques. All rights reserved.</p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="right-panel" style={{
        width:480, flexShrink:0, background:"#f8fafc",
        display:"flex", flexDirection:"column", justifyContent:"center",
        padding:"48px 44px", minHeight:"100vh",
      }}>

        {/* Header */}
        <div style={{ marginBottom:36 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"#e8f4fd", border:"1px solid #bdd6f0", borderRadius:20, padding:"5px 14px", marginBottom:20 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e" }}/>
            <span style={{ fontSize:11.5, fontWeight:600, color:"#0f4c81", letterSpacing:".06em" }}>ADMIN ACCESS</span>
          </div>
          <h1 style={{ fontWeight:800, fontSize:"clamp(24px,3vw,32px)", color:"#1a1a2e", marginBottom:8, lineHeight:1.2 }}>Sign in to Dashboard</h1>
          <p style={{ fontSize:14, color:"#6b7280", lineHeight:1.6 }}>Enter your credentials to manage CodeTechniques</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background:"#fee2e2", border:"1px solid #fca5a5", borderRadius:10, padding:"12px 16px", fontSize:13.5, color:"#b91c1c", marginBottom:24, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:16 }}>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="field" style={{ marginBottom:18 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"#6b7280", marginBottom:7 }}>
              Email Address
            </label>
            <input type="email" placeholder="admin@codetechniques.in"
              value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>

          {/* Password */}
          <div className="field" style={{ marginBottom:12 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"#6b7280", marginBottom:7 }}>
              Password
            </label>
            <div className="pwd-wrap" style={{ position:"relative" }}>
              <input type={showPwd?"text":"password"} placeholder="Enter your password"
                value={password} onChange={e=>setPassword(e.target.value)} required />
              <button type="button" className="eye-btn" onClick={()=>setShowPwd(s=>!s)}>
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div style={{ textAlign:"right", marginBottom:28 }}>
            <a href="/admin/forgot-password" className="forgot">Forgot password?</a>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        {/* Footer note */}
        <div style={{ marginTop:32, padding:"16px", background:"#fff", borderRadius:10, border:"1px solid #e2e8f0" }}>
          <p style={{ fontSize:12.5, color:"#6b7280", lineHeight:1.7, display:"flex", gap:8 }}>
            <span>🔒</span>
            <span>This is a restricted area. All login attempts are logged and monitored for security.</span>
          </p>
        </div>
      </div>

    </div>
  );
}