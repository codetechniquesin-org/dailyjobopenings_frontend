import { useState, useEffect, useRef } from "react";
import AlertBar from "../components/alertbar";
import TopTicker from "../components/topticker";
import Navbar from "../components/navbar";
import Footer from "../components/footer";



/* ─────────────────────────────────────────────
   IMPORTANT — FORMSPREE SETUP (read before use)
   ─────────────────────────────────────────────
   1. Go to https://formspree.io and sign up (free)
   2. Click "New Form" → give it a name like "CodeTechniques Contact"
   3. Copy your Form ID (looks like: xpwzgkrb)
   4. Replace YOUR_FORMSPREE_ID below with that ID
   5. Formspree free plan: 50 submissions/month
      Upgrade at formspree.io/plans for more
   ─────────────────────────────────────────────  */
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID; // 👈 replace this

const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`;

/* ── Theme ── */
const C = {
  primary: "#0f4c81",
  accent:  "#e8472a",
  gold:    "#f5a623",
  light:   "#f4f7fb",
  green:   "#16a34a",
  text:    "#1a1a2e",
  muted:   "#6b7280",
  border:  "#e2e8f0",
};

/* ── Breakpoint hook ── */
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { w, isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024 };
}

/* ── Scroll-reveal hook ── */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Contact info cards ── */
const CONTACT_CARDS = [
  {
    icon: "📧",
    title: "Email Us",
    lines: ["hello@codetechniques.in", "support@codetechniques.in"],
    sub: "We reply within 24 hours",
    bg: "#e8f4fd", border: "#bdd6f0", iconBg: "#0f4c81",
  },
  {
    icon: "📱",
    title: "WhatsApp",
    lines: ["+91 98765 43210"],
    sub: "Mon – Sat, 9 AM – 7 PM IST",
    bg: "#f0fff4", border: "#86efac", iconBg: "#16a34a",
  },
  {
    icon: "📍",
    title: "Office",
    lines: ["3rd Floor, Tech Park,", "Hitech City, Hyderabad — 500081"],
    sub: "By appointment only",
    bg: "#fff7ed", border: "#fcd9aa", iconBg: "#c2410c",
  },
];

const INQUIRY_TYPES = [
  "General Inquiry",
  "Job Listing / Partnership",
  "Report a Fake Job",
  "Advertise With Us",
  "Press / Media",
  "Technical Support",
  "Other",
];

/* ── Input styles ── */
const baseInput = {
  width: "100%",
  padding: "11px 14px",
  fontSize: 14,
  border: `1.5px solid ${C.border}`,
  borderRadius: 10,
  outline: "none",
  background: "#fafafa",
  color: C.text,
  fontFamily: "'DM Sans', sans-serif",
  transition: "border-color 0.18s, box-shadow 0.18s",
  boxSizing: "border-box",
};

function Input({ label, required, error, hint, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: C.muted, marginBottom: 6 }}>
        {label}{required && <span style={{ color: C.accent, marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && <p style={{ color: C.accent, fontSize: 11.5, marginTop: 4 }}>{error}</p>}
      {hint && !error && <p style={{ color: "#9ca3af", fontSize: 11.5, marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <span style={{ width: 4, height: 20, background: C.accent, borderRadius: 3, display: "inline-block" }} />
      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.accent }}>
        {children}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════ */
export default function Contact() {
  const bp = useBreakpoint();
  const { isMobile, isTablet, isDesktop } = bp;
  const gutter = isMobile ? "16px" : isTablet ? "20px" : "32px";

  /* ── Form state ── */
  const [form, setForm] = useState({
    name: "", email: "", phone: "", inquiryType: "", subject: "", message: "",
  });
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState("idle"); // idle | submitting | success | error
  const [serverMsg, setServerMsg] = useState("");

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name        = "Your name is required";
    if (!form.email.trim())       e.email       = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.inquiryType)        e.inquiryType = "Please select an inquiry type";
    if (!form.subject.trim())     e.subject     = "Subject is required";
    if (!form.message.trim())     e.message     = "Message cannot be empty";
    else if (form.message.trim().length < 20) e.message = "Please write at least 20 characters";
    return e;
  };

  /* ── Submit → Formspree ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("submitting");
    setServerMsg("");

    try {
      const res = await fetch(FORMSPREE_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name:        form.name,
          email:       form.email,
          phone:       form.phone || "Not provided",
          inquiryType: form.inquiryType,
          subject:     form.subject,
          message:     form.message,
          _subject:    `[CodeTechniques] ${form.inquiryType} — ${form.subject}`,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", inquiryType: "", subject: "", message: "" });
        setErrors({});
      } else {
        setStatus("error");
        setServerMsg(data?.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setServerMsg("Network error. Check your connection and try again.");
    }
  };

  const inputFocusStyle = (hasErr) => ({
    ...baseInput,
    border: hasErr ? `1.5px solid ${C.accent}` : baseInput.border,
  });

  const focusHandlers = {
    onFocus: (e) => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px rgba(15,76,129,0.1)`; },
    onBlur:  (e) => { e.target.style.borderColor = C.border;  e.target.style.boxShadow = "none"; },
  };

  return (
    <div style={{ width: "100%", overflowX: "hidden", fontFamily: "'DM Sans', sans-serif", background: C.light, color: C.text, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100% !important; margin: 0 !important; overflow-x: hidden !important; background: ${C.light} !important; }
        #root { width: 100% !important; overflow-x: hidden !important; }
        a { text-decoration: none; color: inherit; }

        .contact-card { transition: transform 0.22s, box-shadow 0.22s; cursor: default; }
        .contact-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(15,76,129,0.1); }

        .submit-btn { transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(15,76,129,0.3); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        select option { color: ${C.text}; }

        @media (max-width: 639px) {
          .hero-heading  { font-size: clamp(26px, 8vw, 36px) !important; }
          .main-grid     { grid-template-columns: 1fr !important; }
          .cards-grid    { grid-template-columns: 1fr !important; }
          .two-col-input { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .hero-heading  { font-size: clamp(32px, 5vw, 46px) !important; }
          .main-grid     { grid-template-columns: 1fr !important; }
          .cards-grid    { grid-template-columns: repeat(3, 1fr) !important; }
          .two-col-input { grid-template-columns: 1fr 1fr !important; }
        }
        @media (min-width: 1024px) {
          .hero-heading  { font-size: clamp(38px, 4vw, 54px) !important; }
          .main-grid     { grid-template-columns: 1fr 420px !important; }
          .cards-grid    { grid-template-columns: repeat(3, 1fr) !important; }
          .two-col-input { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── Top components ── */}
      <AlertBar C={{ accent: "#ff4d4f" }} />
      <TopTicker C={C} gutter={gutter} isMobile={isMobile} isDesktop={isDesktop} />
      <Navbar bp={bp} onMenuOpen={() => {}} />

      {/* ════════════════════════════════════
          HERO
      ════════════════════════════════════ */}
      <section style={{ width: "100%", background: `linear-gradient(135deg, ${C.primary} 0%, #1565c0 55%, #0d47a1 100%)`, color: "#fff", padding: isMobile ? "48px 0 40px" : "68px 0 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -40, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        <div style={{ width: "100%", padding: `0 ${gutter}`, boxSizing: "border-box" }}>
          <Reveal>
            {/* Breadcrumb */}
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 18, display: "flex", alignItems: "center", gap: 6 }}>
              <a href="/" style={{ color: "rgba(255,255,255,0.5)" }}>Home</a>
              <span>›</span>
              <span style={{ color: "#fff" }}>Contact Us</span>
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "5px 14px", marginBottom: 18 }}>
              <span style={{ fontSize: 14 }}>💬</span>
              <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em" }}>We'd love to hear from you</span>
            </div>

            <h1 className="hero-heading" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, lineHeight: 1.15, marginBottom: 14 }}>
              Get in Touch with<br />
              <span style={{ color: C.gold }}>CodeTechniques</span>
            </h1>

            <p style={{ fontSize: isMobile ? 13.5 : 15, opacity: 0.82, lineHeight: 1.75, maxWidth: 520 }}>
              Have a question, want to advertise, report a listing, or just say hello? We're a small team and we read every message personally.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════
          CONTACT CARDS
      ════════════════════════════════════ */}
      <section style={{ width: "100%", background: "#fff", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: "100%", padding: `36px ${gutter}`, boxSizing: "border-box" }}>
          <div className="cards-grid" style={{ display: "grid", gap: 16 }}>
            {CONTACT_CARDS.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.08}>
                <div className="contact-card" style={{ background: card.bg, border: `1.5px solid ${card.border}`, borderRadius: 14, padding: isMobile ? 20 : 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: card.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                      {card.icon}
                    </div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: C.text }}>{card.title}</div>
                  </div>
                  {card.lines.map(l => (
                    <div key={l} style={{ fontSize: 13.5, color: C.text, fontWeight: 500, marginBottom: 3 }}>{l}</div>
                  ))}
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>{card.sub}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          MAIN: FORM + SIDEBAR
      ════════════════════════════════════ */}
      <section style={{ width: "100%", padding: isMobile ? "40px 0 60px" : "60px 0 80px" }}>
        <div style={{ width: "100%", padding: `0 ${gutter}`, boxSizing: "border-box" }}>
          <div className="main-grid" style={{ display: "grid", gap: isMobile ? 36 : 32, alignItems: "flex-start" }}>

            {/* ── LEFT: FORM ── */}
            <Reveal delay={0}>
              <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${C.border}`, padding: isMobile ? 24 : 36, boxShadow: "0 4px 24px rgba(15,76,129,0.06)" }}>
                <SectionLabel>Send a Message</SectionLabel>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? 20 : 26, fontWeight: 800, color: C.text, marginBottom: 6 }}>
                  Fill in the form below
                </h2>
                <p style={{ fontSize: 13, color: C.muted, marginBottom: 28, lineHeight: 1.7 }}>
                  All fields marked <span style={{ color: C.accent }}>*</span> are required. We reply within 24 hours on business days.
                </p>

                {/* ── Formspree not configured warning ── */}
                {FORMSPREE_ID === "YOUR_FORMSPREE_ID" && (
                  <div style={{ background: "#fff8e1", border: `1.5px dashed ${C.gold}`, borderRadius: 10, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "#92400e" }}>
                    ⚠️ <strong>Setup required:</strong> Replace <code style={{ background: "#fef3c7", padding: "1px 5px", borderRadius: 3 }}>YOUR_FORMSPREE_ID</code> at the top of this file with your real Formspree form ID. See the setup guide below.
                  </div>
                )}

                {/* ── Success state ── */}
                {status === "success" ? (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 32 }}>✓</div>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: C.green, marginBottom: 10 }}>Message Sent!</h3>
                    <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
                      Thanks for reaching out! We've received your message and will get back to you within 24 hours on business days.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      style={{ background: C.primary, color: "#fff", border: "none", padding: "10px 24px", borderRadius: 9, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Name + Email */}
                    <div className="two-col-input" style={{ display: "grid", gap: 16 }}>
                      <Input label="Full Name" required error={errors.name}>
                        <input
                          type="text" placeholder="Rahul Sharma"
                          value={form.name} onChange={set("name")}
                          style={{ ...inputFocusStyle(errors.name) }} {...focusHandlers}
                        />
                      </Input>
                      <Input label="Email Address" required error={errors.email}>
                        <input
                          type="email" placeholder="rahul@example.com"
                          value={form.email} onChange={set("email")}
                          style={{ ...inputFocusStyle(errors.email) }} {...focusHandlers}
                        />
                      </Input>
                    </div>

                    {/* Phone + Inquiry Type */}
                    <div className="two-col-input" style={{ display: "grid", gap: 16 }}>
                      <Input label="Phone Number" hint="Optional — for urgent queries">
                        <input
                          type="tel" placeholder="+91 98765 43210"
                          value={form.phone} onChange={set("phone")}
                          style={baseInput} {...focusHandlers}
                        />
                      </Input>
                      <Input label="Inquiry Type" required error={errors.inquiryType}>
                        <select
                          value={form.inquiryType} onChange={set("inquiryType")}
                          style={{
                            ...inputFocusStyle(errors.inquiryType),
                            appearance: "none",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 14px center",
                            paddingRight: 36,
                          }}
                          {...focusHandlers}
                        >
                          <option value="">Select type...</option>
                          {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </Input>
                    </div>

                    {/* Subject */}
                    <Input label="Subject" required error={errors.subject}>
                      <input
                        type="text" placeholder="Brief subject of your message"
                        value={form.subject} onChange={set("subject")}
                        style={{ ...inputFocusStyle(errors.subject) }} {...focusHandlers}
                      />
                    </Input>

                    {/* Message */}
                    <Input label="Message" required error={errors.message} hint="Minimum 20 characters">
                      <textarea
                        placeholder="Describe your query in detail. The more context you give, the faster we can help..."
                        value={form.message} onChange={set("message")} rows={5}
                        style={{ ...inputFocusStyle(errors.message), resize: "vertical", minHeight: 120 }}
                        {...focusHandlers}
                      />
                    </Input>

                    {/* Server error */}
                    {status === "error" && (
                      <div style={{ background: "#fee2e2", border: `1px solid #fca5a5`, borderRadius: 9, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#b91c1c" }}>
                        ❌ {serverMsg}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="submit-btn"
                      style={{
                        width: "100%", padding: "13px", borderRadius: 11,
                        background: `linear-gradient(135deg, ${C.primary}, #1565c0)`,
                        color: "#fff", border: "none",
                        fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
                        letterSpacing: "0.03em", cursor: "pointer",
                      }}
                    >
                      {status === "submitting" ? "Sending…" : "Send Message →"}
                    </button>

                    <p style={{ fontSize: 11.5, color: C.muted, textAlign: "center", marginTop: 12 }}>
                      🔒 Your information is never shared or sold. We hate spam too.
                    </p>
                  </form>
                )}
              </div>
            </Reveal>

            {/* ── RIGHT: SIDEBAR ── */}
            <div>
              {/* Response time */}
              <Reveal delay={0.1}>
                <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 16 }}>⏱ Response Times</div>
                  {[
                    ["General Inquiry",         "Within 24 hours",  C.green],
                    ["Job Listing / Partnership","Within 12 hours",  C.primary],
                    ["Report a Fake Job",        "Within 2 hours",   C.accent],
                    ["Technical Support",        "Within 6 hours",   "#7c3aed"],
                    ["Press / Media",            "Within 48 hours",  C.gold],
                  ].map(([type, time, color]) => (
                    <div key={type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.border}`, gap: 8 }}>
                      <span style={{ fontSize: 12.5, color: C.text }}>{type}</span>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color, background: color + "18", padding: "2px 9px", borderRadius: 10, whiteSpace: "nowrap" }}>{time}</span>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* WhatsApp CTA */}
              <Reveal delay={0.15}>
                <div style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e)", color: "#fff", borderRadius: 14, padding: 22, marginBottom: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>📱</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, marginBottom: 8 }}>Get Faster Help on WhatsApp</div>
                  <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", marginBottom: 16, lineHeight: 1.6 }}>For urgent queries, WhatsApp is the fastest way to reach us.</p>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={{ display: "inline-block", background: "#25D366", color: "#fff", padding: "10px 22px", borderRadius: 9, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13 }}>
                    Chat on WhatsApp →
                  </a>
                </div>
              </Reveal>

              {/* Formspree setup guide */}
              <Reveal delay={0.2}>
                <div style={{ background: "linear-gradient(135deg,#f0f7ff,#e8f4fd)", border: `1.5px solid #bdd6f0`, borderRadius: 14, padding: 22 }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13.5, color: C.primary, marginBottom: 14 }}>
                    🔧 Formspree Setup Guide
                  </div>
                  {[
                    ["1", "Go to formspree.io and sign up free"],
                    ["2", 'Click "New Form" and name it'],
                    ["3", "Copy your Form ID (e.g. xpwzgkrb)"],
                    ["4", "Open Contact.jsx and find FORMSPREE_ID"],
                    ["5", "Replace YOUR_FORMSPREE_ID with your ID"],
                    ["6", "Submit a test — check your email! ✓"],
                  ].map(([n, step]) => (
                    <div key={n} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{n}</div>
                      <span style={{ fontSize: 12.5, color: C.text, lineHeight: 1.55 }}>{step}</span>
                    </div>
                  ))}
                  <a href="https://formspree.io" target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", marginTop: 14, background: C.primary, color: "#fff", padding: "9px", borderRadius: 8, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12.5 }}>
                    Go to Formspree →
                  </a>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          MAP / OFFICE STRIP
      ════════════════════════════════════ */}
      <section style={{ width: "100%", background: "#fff", borderTop: `1px solid ${C.border}`, padding: isMobile ? "40px 0" : "60px 0" }}>
        <div style={{ width: "100%", padding: `0 ${gutter}`, boxSizing: "border-box" }}>
          <Reveal>
            <SectionLabel>Find Us</SectionLabel>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? 22 : 30, fontWeight: 800, color: C.text, marginBottom: 24 }}>
              Our Office
            </h2>
          </Reveal>
          {/* Map embed placeholder — replace src with your Google Maps embed URL */}
          <Reveal delay={0.1}>
            <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, background: C.light, height: isMobile ? 220 : 320, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              <span style={{ fontSize: 40 }}>🗺️</span>
              <p style={{ fontSize: 13.5, color: C.muted, textAlign: "center", maxWidth: 320, lineHeight: 1.7 }}>
                Replace this div with a Google Maps <code style={{ background: "#e2e8f0", padding: "1px 5px", borderRadius: 3 }}>&lt;iframe&gt;</code> embed for your office location.
              </p>
              <a
                href="https://maps.google.com/?q=Hitech+City+Hyderabad"
                target="_blank" rel="noreferrer"
                style={{ background: C.primary, color: "#fff", padding: "8px 18px", borderRadius: 8, fontSize: 13, fontFamily: "'Syne', sans-serif", fontWeight: 600 }}
              >
                Open in Google Maps →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer bp={bp} gutter={gutter} />
    </div>
  );
}