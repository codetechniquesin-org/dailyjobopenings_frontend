import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VITE_API_BASE_URL from "../../config/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [pw,      setPw]      = useState("");
  const [cpw,     setCpw]     = useState("");
  const [show,    setShow]    = useState([false, false]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const match   = pw && cpw && pw === cpw;
  const noMatch = pw && cpw && pw !== cpw;

  const handleReset = async (e) => {
    e.preventDefault();
    if (!match) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken") ||
        JSON.parse(localStorage.getItem("adminInfo") || "{}").token;
      const res = await fetch(`${VITE_API_BASE_URL}/api/admin/reset-password`, {
        method:"PUT",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ newPassword: pw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      const admin = JSON.parse(localStorage.getItem("adminInfo") || "{}");
      admin.isTempPassword = false;
      localStorage.setItem("adminInfo", JSON.stringify(admin));
      setSuccess(true);
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const toggleEye = (i) => setShow(s => s.map((v,j) => j===i ? !v : v));

  const inp = (err) => ({
    width:"100%", padding:"12px 44px 12px 16px", fontSize:14,
    fontFamily:"'DM Sans',Arial,sans-serif",
    border:`1.5px solid ${err ? "#fca5a5" : match && !err ? "#86efac" : "#e0e7ff"}`,
    borderRadius:11, outline:"none", background:"#fafbff", color:"#1e1b4b",
    transition:"border-color .2s, box-shadow .2s", boxSizing:"border-box",
  });

  return (
    <div style={{ minHeight:"100vh", width:"100%", display:"flex", alignItems:"center", justifyContent:"center",
      background:"linear-gradient(135deg,#eef2ff 0%,#fdf4ff 50%,#eff6ff 100%)",
      fontFamily:"'DM Sans',Arial,sans-serif", padding:16 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body,#root{width:100%!important;margin:0!important;overflow-x:hidden!important;}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pop{0%{transform:scale(.85);opacity:0}100%{transform:scale(1);opacity:1}}
        .card{animation:slideUp .5s cubic-bezier(.16,1,.3,1)}
        .success-icon{animation:pop .4s cubic-bezier(.16,1,.3,1)}
        input:focus{border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,.12)!important;}
        .eye{position:absolute;right:13px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:16px;color:#a5b4fc;padding:0;line-height:1;transition:color .18s;}
        .eye:hover{color:#6366f1;}
        .btn{width:100%;padding:13px;border:none;border-radius:11px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:700;font-size:15px;font-family:inherit;cursor:pointer;transition:all .22s;margin-top:8px;}
        .btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 28px rgba(99,102,241,.35);}
        .btn:disabled{opacity:.55;cursor:not-allowed;}
      `}</style>

      <div className="card" style={{ width:"100%", maxWidth:400, background:"#fff", borderRadius:20, padding:"36px 32px", boxShadow:"0 20px 60px rgba(99,102,241,.12), 0 4px 16px rgba(99,102,241,.08)" }}>

        {!success ? (
          <>
            {/* Header */}
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, margin:"0 auto 14px" }}>🔑</div>
              <h1 style={{ fontWeight:800, fontSize:21, color:"#1e1b4b", marginBottom:5 }}>Reset Password</h1>
              <p style={{ fontSize:13, color:"#a5b4fc" }}>Create a new secure password to continue</p>
            </div>

            <form onSubmit={handleReset}>
              {/* New password */}
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:11.5, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"#6366f1", marginBottom:7 }}>New Password</label>
                <div style={{ position:"relative" }}>
                  <input type={show[0]?"text":"password"} placeholder="Enter new password"
                    value={pw} onChange={e=>setPw(e.target.value)} required style={inp(noMatch)} />
                  <button type="button" className="eye" onClick={()=>toggleEye(0)}>{show[0]?"🙈":"👁️"}</button>
                </div>
              </div>

              {/* Confirm password */}
              <div style={{ marginBottom:10 }}>
                <label style={{ display:"block", fontSize:11.5, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"#6366f1", marginBottom:7 }}>Confirm Password</label>
                <div style={{ position:"relative" }}>
                  <input type={show[1]?"text":"password"} placeholder="Re-enter password"
                    value={cpw} onChange={e=>setCpw(e.target.value)} required style={inp(noMatch)} />
                  <button type="button" className="eye" onClick={()=>toggleEye(1)}>{show[1]?"🙈":"👁️"}</button>
                </div>
              </div>

              {/* Match feedback */}
              {noMatch && <p style={{ fontSize:12.5, color:"#dc2626", fontWeight:500, marginBottom:10 }}>⚠️ Passwords do not match</p>}
              {match   && <p style={{ fontSize:12.5, color:"#16a34a", fontWeight:500, marginBottom:10 }}>✅ Passwords match</p>}

              <button type="submit" disabled={loading || !match} className="btn">
                {loading ? "Updating…" : "Update Password →"}
              </button>
            </form>
          </>
        ) : (
          /* Success state */
          <div style={{ textAlign:"center", padding:"16px 0" }}>
            <div className="success-icon" style={{ width:68, height:68, borderRadius:"50%", background:"linear-gradient(135deg,#bbf7d0,#86efac)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, margin:"0 auto 20px" }}>✓</div>
            <h2 style={{ fontWeight:800, fontSize:20, color:"#1e1b4b", marginBottom:8 }}>Password Updated!</h2>
            <p style={{ fontSize:13.5, color:"#a5b4fc", lineHeight:1.7, marginBottom:24 }}>
              Your password has been reset successfully.<br/>You can now log in with your new password.
            </p>
            <button onClick={()=>navigate("/admin/login")} className="btn" style={{ marginTop:0 }}>
              Go to Login →
            </button>
          </div>
        )}

        <p style={{ textAlign:"center", fontSize:12, color:"#c7d2fe", marginTop:22 }}>🔒 Secured · Admin access only</p>
      </div>
    </div>
  );
}