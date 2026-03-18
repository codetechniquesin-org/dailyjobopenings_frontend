import { useState, useEffect } from "react";
import AlertBar from "../components/alertbar";
import TopTicker from "../components/topticker";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const C = {
  primary:"#0f4c81", accent:"#e8472a", gold:"#f5a623",
  light:"#f4f7fb", green:"#16a34a", text:"#1a1a2e",
  muted:"#6b7280", border:"#e2e8f0",
};

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID; // 👈 same Formspree account — create a new form called "Advertise"

const PACKAGES = [
  { name:"Starter",   price:"₹4,999/mo",  color:C.primary,  bg:"#e8f4fd", features:["1 Banner Ad",  "5,000 impressions",  "Job category page",  "Email support"] },
  { name:"Growth",    price:"₹12,999/mo", color:C.accent,   bg:"#fff0f0", features:["3 Banner Ads", "25,000 impressions", "Homepage placement", "Priority support"], popular:true },
  { name:"Enterprise",price:"Custom",     color:"#7c3aed",  bg:"#ede9fe", features:["Unlimited Ads","Full site takeover", "WhatsApp blasts",   "Dedicated manager"] },
];

const STATS = [
  ["2.3L+","Monthly Visitors"], ["12K+","Daily Active Users"],
  ["850+","Hiring Companies"],  ["98%","Fresher Audience"],
];

const WHY = [
  ["🎯","Laser-targeted","100% fresher audience — 0 to 3 yrs experience, actively job hunting"],
  ["📍","India-wide reach","Hyderabad, Bangalore, Pune, Mumbai, Chennai & WFH seekers"],
  ["📱","Multi-channel","Website banners, WhatsApp blasts (5L+ subscribers), email newsletters"],
  ["📊","Real analytics","Weekly performance reports — impressions, clicks, CTR"],
];

function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { w, isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024 };
}

export default function Advertise() {
  const bp = useBreakpoint();
  const { isMobile, isDesktop } = bp;
  const g = isMobile ? "16px" : "32px";

  const [form, setForm] = useState({ name:"", email:"", company:"", budget:"", message:"" });
  const [status, setStatus] = useState("idle"); // idle | sending | done | err
  const [errors, setErrors] = useState({});

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.company.trim()) e.company = "Required";
    if (!form.message.trim()) e.message = "Required";
    return e;
  };

  const submit = async e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("sending");
    try {
      const r = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method:"POST",
        headers:{ "Content-Type":"application/json", Accept:"application/json" },
        body: JSON.stringify({ ...form, _subject:`[Advertise] ${form.company} — ${form.budget || "Budget TBD"}` }),
      });
      setStatus(r.ok ? "done" : "err");
    } catch { setStatus("err"); }
  };

  const inp = (err) => ({
    width:"100%", padding:"10px 13px", fontSize:14, fontFamily:"'DM Sans',Arial,sans-serif",
    border:`1.5px solid ${err ? C.accent : C.border}`, borderRadius:9,
    outline:"none", background:"#fafafa", color:C.text, boxSizing:"border-box",
  });

  const focus = {
    onFocus: e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = "0 0 0 3px rgba(15,76,129,.09)"; },
    onBlur:  e => { e.target.style.borderColor = C.border;  e.target.style.boxShadow = "none"; },
  };

  const Label = ({ t, req }) => (
    <label style={{ display:"block", fontSize:11.5, fontWeight:700, textTransform:"uppercase",
      letterSpacing:".07em", color:C.muted, marginBottom:5 }}>
      {t}{req && <span style={{ color:C.accent, marginLeft:3 }}>*</span>}
    </label>
  );

  const Err = ({ msg }) => msg ? <p style={{ color:C.accent, fontSize:11.5, marginTop:3 }}>{msg}</p> : null;

  const Row = ({ children }) => (
    <div style={{ marginBottom:16 }}>{children}</div>
  );

  return (
    <div style={{ width:"100%", overflowX:"hidden", fontFamily:"'DM Sans',Arial,sans-serif",
      background:C.light, color:C.text, minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { width:100%!important; margin:0!important; overflow-x:hidden!important; }
        #root { width:100%!important; overflow-x:hidden!important; }
        a { text-decoration:none; color:inherit; }
        .pkg-card:hover { transform:translateY(-4px); box-shadow:0 14px 36px rgba(0,0,0,.1); }
        .why-card:hover { border-color:${C.primary}!important; }
        .pkg-card, .why-card { transition:all .22s; }
        @media(max-width:639px){
          .stats-row { grid-template-columns:1fr 1fr!important; }
          .pkg-row   { grid-template-columns:1fr!important; }
          .why-row   { grid-template-columns:1fr!important; }
          .main-grid { grid-template-columns:1fr!important; }
        }
        @media(min-width:640px) and (max-width:1023px){
          .pkg-row   { grid-template-columns:1fr 1fr!important; }
          .why-row   { grid-template-columns:1fr 1fr!important; }
          .main-grid { grid-template-columns:1fr!important; }
        }
      `}</style>

      <AlertBar C={{ accent:"#ff4d4f" }} />
      <TopTicker C={C} gutter={g} isMobile={bp.isMobile} isDesktop={isDesktop} />
      <Navbar bp={bp} onMenuOpen={() => {}} />

      {/* ── HERO ── */}
      <section style={{ width:"100%", background:`linear-gradient(135deg,${C.primary},#1565c0,#0d47a1)`,
        color:"#fff", padding:isMobile?"44px 0 36px":"64px 0 52px", overflow:"hidden", position:"relative" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:240, height:240, borderRadius:"50%", background:"rgba(255,255,255,.04)", pointerEvents:"none" }} />
        <div style={{ width:"100%", padding:`0 ${g}`, boxSizing:"border-box" }}>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", marginBottom:14, display:"flex", gap:6 }}>
            <a href="/" style={{ color:"rgba(255,255,255,.5)" }}>Home</a><span>›</span>
            <span style={{ color:"#fff" }}>Advertise With Us</span>
          </div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.12)",
            border:"1px solid rgba(255,255,255,.2)", borderRadius:20, padding:"5px 14px", marginBottom:16 }}>
            <span style={{ fontSize:11.5, fontWeight:600 }}>📢 Reach 2.3L+ Freshers Every Month</span>
          </div>
          <h1 style={{ fontSize:isMobile?"clamp(26px,8vw,36px)":"clamp(36px,4vw,52px)",
            fontWeight:800, lineHeight:1.15, marginBottom:12 }}>
            Advertise on<br/><span style={{ color:C.gold }}>CodeTechniques</span>
          </h1>
          <p style={{ fontSize:isMobile?13.5:15, opacity:.82, maxWidth:520, lineHeight:1.75 }}>
            Put your brand, course, or job listing in front of India's most active fresher job-seekers.
            Verified traffic. Real candidates. Measurable results.
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ width:"100%", background:"#fff", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ width:"100%", padding:`24px ${g}`, boxSizing:"border-box" }}>
          <div className="stats-row" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:C.border }}>
            {STATS.map(([v, l]) => (
              <div key={l} style={{ background:"#fff", padding:"22px 16px", textAlign:"center" }}>
                <div style={{ fontSize:isMobile?22:30, fontWeight:800, color:C.primary, lineHeight:1 }}>{v}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ADVERTISE ── */}
      <section style={{ width:"100%", padding:isMobile?"40px 0":"60px 0" }}>
        <div style={{ width:"100%", padding:`0 ${g}`, boxSizing:"border-box" }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:".14em", textTransform:"uppercase",
            color:C.accent, marginBottom:8 }}>Why Advertise</p>
          <h2 style={{ fontSize:isMobile?22:32, fontWeight:800, color:C.text, marginBottom:28 }}>
            Why brands choose CodeTechniques
          </h2>
          <div className="why-row" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
            {WHY.map(([icon, title, desc]) => (
              <div key={title} className="why-card" style={{ background:"#fff", border:`1.5px solid ${C.border}`,
                borderRadius:12, padding:"20px 18px", cursor:"default" }}>
                <div style={{ fontSize:28, marginBottom:12 }}>{icon}</div>
                <div style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:6 }}>{title}</div>
                <div style={{ fontSize:12.5, color:C.muted, lineHeight:1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section style={{ width:"100%", background:"#fff", padding:isMobile?"40px 0":"60px 0" }}>
        <div style={{ width:"100%", padding:`0 ${g}`, boxSizing:"border-box" }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:".14em", textTransform:"uppercase",
            color:C.accent, marginBottom:8 }}>Pricing</p>
          <h2 style={{ fontSize:isMobile?22:32, fontWeight:800, color:C.text, marginBottom:28 }}>
            Advertising packages
          </h2>
          <div className="pkg-row" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {PACKAGES.map(p => (
              <div key={p.name} className="pkg-card" style={{ border:`2px solid ${p.popular ? p.color : C.border}`,
                borderRadius:14, overflow:"hidden", position:"relative", cursor:"default" }}>
                {p.popular && (
                  <div style={{ background:p.color, color:"#fff", textAlign:"center",
                    fontSize:11, fontWeight:700, padding:"5px", letterSpacing:".08em" }}>
                    ⭐ MOST POPULAR
                  </div>
                )}
                <div style={{ background:p.bg, padding:"22px 20px", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ fontWeight:800, fontSize:16, color:p.color }}>{p.name}</div>
                  <div style={{ fontWeight:800, fontSize:26, color:C.text, marginTop:4 }}>{p.price}</div>
                </div>
                <div style={{ padding:"18px 20px" }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display:"flex", alignItems:"center", gap:8,
                      fontSize:13, color:C.text, marginBottom:9 }}>
                      <span style={{ color:C.green, fontWeight:700 }}>✓</span>{f}
                    </div>
                  ))}
                  <a href="#contact-form" style={{ display:"block", textAlign:"center",
                    background:p.color, color:"#fff", padding:"10px", borderRadius:8,
                    fontWeight:700, fontSize:13, marginTop:14 }}>
                    Get Started →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section id="contact-form" style={{ width:"100%", padding:isMobile?"40px 0 60px":"60px 0 80px" }}>
        <div style={{ width:"100%", padding:`0 ${g}`, boxSizing:"border-box" }}>
          <div className="main-grid" style={{ display:"grid", gridTemplateColumns:"1fr 400px", gap:32, alignItems:"flex-start" }}>

            {/* Left info */}
            <div>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:".14em", textTransform:"uppercase",
                color:C.accent, marginBottom:8 }}>Get In Touch</p>
              <h2 style={{ fontSize:isMobile?22:32, fontWeight:800, color:C.text, marginBottom:14 }}>
                Let's talk about your campaign
              </h2>
              <p style={{ fontSize:14, color:C.muted, lineHeight:1.8, marginBottom:24 }}>
                Fill in the form and our advertising team will get back to you within 12 hours with a customised proposal.
              </p>
              {[
                ["📧","Email","advertise@codetechniques.in"],
                ["📱","WhatsApp","+91 98765 43210"],
                ["⏱️","Response time","Within 12 business hours"],
              ].map(([icon, label, val]) => (
                <div key={label} style={{ display:"flex", gap:12, alignItems:"center",
                  padding:"12px 14px", background:"#fff", borderRadius:10,
                  border:`1px solid ${C.border}`, marginBottom:10 }}>
                  <span style={{ fontSize:20 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:".06em",
                      fontWeight:700, color:C.muted }}>{label}</div>
                    <div style={{ fontSize:13.5, fontWeight:500, color:C.primary }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div style={{ background:"#fff", borderRadius:14, border:`1px solid ${C.border}`,
              padding:isMobile?20:28, boxShadow:"0 4px 24px rgba(15,76,129,.06)" }}>

              {FORMSPREE_ID === "YOUR_FORMSPREE_ID" && (
                <div style={{ background:"#fff8e1", border:`1.5px dashed ${C.gold}`, borderRadius:8,
                  padding:"10px 14px", marginBottom:16, fontSize:12.5, color:"#92400e" }}>
                  ⚠️ Set your <code>FORMSPREE_ID</code> at the top of this file.
                </div>
              )}

              {status === "done" ? (
                <div style={{ textAlign:"center", padding:"36px 16px" }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
                  <h3 style={{ fontWeight:800, fontSize:18, color:C.green, marginBottom:8 }}>Request Received!</h3>
                  <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.7, marginBottom:20 }}>
                    We'll send you a tailored proposal within 12 hours.
                  </p>
                  <button onClick={() => setStatus("idle")}
                    style={{ background:C.primary, color:"#fff", border:"none", padding:"9px 22px",
                      borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer" }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <Row>
                    <Label t="Your Name" req />
                    <input placeholder="Rahul Sharma" value={form.name} onChange={set("name")}
                      style={inp(errors.name)} {...focus} />
                    <Err msg={errors.name} />
                  </Row>
                  <Row>
                    <Label t="Work Email" req />
                    <input type="email" placeholder="rahul@company.com" value={form.email} onChange={set("email")}
                      style={inp(errors.email)} {...focus} />
                    <Err msg={errors.email} />
                  </Row>
                  <Row>
                    <Label t="Company / Brand" req />
                    <input placeholder="Acme Edutech Pvt Ltd" value={form.company} onChange={set("company")}
                      style={inp(errors.company)} {...focus} />
                    <Err msg={errors.company} />
                  </Row>
                  <Row>
                    <Label t="Monthly Budget" />
                    <select value={form.budget} onChange={set("budget")} style={{ ...inp(false),
                      appearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                      backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center", paddingRight:34 }}
                      {...focus}>
                      <option value="">Select budget range...</option>
                      {["Under ₹5,000","₹5,000 – ₹15,000","₹15,000 – ₹50,000","₹50,000+","Let's discuss"].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </Row>
                  <Row>
                    <Label t="What are you promoting?" req />
                    <textarea placeholder="e.g. Online coding course, job posting, EdTech app..." value={form.message}
                      onChange={set("message")} rows={4}
                      style={{ ...inp(errors.message), resize:"vertical" }} {...focus} />
                    <Err msg={errors.message} />
                  </Row>

                  {status === "err" && (
                    <div style={{ background:"#fee2e2", borderRadius:8, padding:"10px 14px",
                      fontSize:13, color:"#b91c1c", marginBottom:14 }}>
                      ❌ Something went wrong. Please try again or email us directly.
                    </div>
                  )}

                  <button type="submit" disabled={status === "sending"}
                    style={{ width:"100%", padding:13, borderRadius:10,
                      background:`linear-gradient(135deg,${C.primary},#1565c0)`,
                      color:"#fff", border:"none", fontWeight:700, fontSize:14,
                      cursor:status === "sending" ? "not-allowed" : "pointer",
                      opacity:status === "sending" ? .65 : 1 }}>
                    {status === "sending" ? "Sending…" : "Send Enquiry →"}
                  </button>
                  <p style={{ fontSize:11.5, color:C.muted, textAlign:"center", marginTop:10 }}>
                    🔒 Your details are never shared with third parties.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer bp={bp} gutter={g} />
    </div>
  );
}