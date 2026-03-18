import { useState, useEffect, useRef } from "react";
import AlertBar from "../components/alertbar";
import TopTicker from "../components/topticker";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

/* ── Theme (matches site-wide palette) ── */
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
function useInView(threshold = 0.12) {
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
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Data ── */
const STATS = [
  { value: "12,400+", label: "Active Job Listings",  icon: "💼" },
  { value: "850+",    label: "Hiring Companies",      icon: "🏢" },
  { value: "2.3L+",   label: "Freshers Hired",        icon: "🎓" },
  { value: "98%",     label: "Satisfaction Rate",     icon: "⭐" },
];

const TEAM = [
  { name: "Ravi Kumar",    role: "Founder & CEO",         initials: "RK", bg: "#e8f4fd", color: "#0f4c81" },
  { name: "Priya Sharma",  role: "Head of Partnerships",  initials: "PS", bg: "#f0fff4", color: "#16a34a" },
  { name: "Arjun Mehta",   role: "Lead Engineer",         initials: "AM", bg: "#fff0f0", color: "#e8472a" },
  { name: "Sneha Reddy",   role: "Content & SEO Lead",    initials: "SR", bg: "#ede9fe", color: "#7c3aed" },
  { name: "Kiran Nair",    role: "Community Manager",     initials: "KN", bg: "#fff7ed", color: "#c2410c" },
  { name: "Divya Patel",   role: "UI/UX Designer",        initials: "DP", bg: "#fef9c3", color: "#a16207" },
];

const VALUES = [
  { icon: "🎯", title: "Verified First",    desc: "Every listing is manually reviewed. No scams, no fake jobs — just real opportunities from real companies." },
  { icon: "⚡", title: "Always Updated",    desc: "We post new openings daily. Freshers checking us at 9 AM see different opportunities by 6 PM." },
  { icon: "🆓", title: "Free for Everyone", desc: "Zero subscription fees for job seekers. Our platform is and will always be free to use." },
  { icon: "🤝", title: "Fresher-First",     desc: "Unlike traditional portals, we design every feature specifically for 0–3 year experience candidates." },
];

const MILESTONES = [
  { year: "2019", event: "CodeTechniques launched with just 50 job listings from 10 local companies." },
  { year: "2020", event: "Expanded to 10 cities. Hit 10,000 active users during the pandemic job crisis." },
  { year: "2021", event: "Launched WhatsApp alerts — 1 lakh subscribers in 90 days." },
  { year: "2022", event: "Crossed 500+ hiring company partnerships including TCS, Infosys, Wipro." },
  { year: "2023", event: "Introduced AI-powered job matching. Placed 50,000 freshers in a single year." },
  { year: "2024", event: "2.3 lakh total hires. Recognized as India's #1 fresher job portal." },
];

const FAQS = [
  { q: "Is CodeTechniques free to use?",              a: "100% free for all job seekers. We never charge candidates for applying, creating a profile, or accessing any feature." },
  { q: "How are job listings verified?",              a: "Every listing goes through a manual review by our team before it goes live. We verify company registration, contact details, and role authenticity." },
  { q: "Can companies post jobs for free?",           a: "Companies get 2 free listings per month. Premium plans unlock unlimited postings, priority placement, and analytics dashboards." },
  { q: "How do I get WhatsApp job alerts?",           a: "Click 'Join Free Group' in the sidebar or footer. You'll receive curated alerts based on your profile — no spam, unsubscribe anytime." },
  { q: "Do you post government job notifications?",   a: "Yes! We cover SSC, UPSC, Banking, Railway, Defence, and all major state PSC notifications with eligibility details and direct links." },
];

/* ── Small components ── */
function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <span style={{ width: 4, height: 20, background: C.accent, borderRadius: 3, display: "inline-block", flexShrink: 0 }} />
      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.accent }}>
        {children}
      </span>
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${C.border}`, padding: 24, ...style }}>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════ */
export default function About() {
  const bp = useBreakpoint();
  const { isMobile, isTablet, isDesktop, w } = bp;
  const gutter = isMobile ? "16px" : isTablet ? "20px" : "32px";
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ width: "100%", overflowX: "hidden", fontFamily: "'DM Sans', sans-serif", background: C.light, color: C.text, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100% !important; margin: 0 !important; overflow-x: hidden !important; background: ${C.light} !important; }
        #root { width: 100% !important; overflow-x: hidden !important; }
        a { text-decoration: none; color: inherit; }

        .stat-card { transition: transform 0.22s, box-shadow 0.22s; }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(15,76,129,0.12); }

        .val-card { transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s; }
        .val-card:hover { transform: translateY(-4px); border-color: ${C.primary} !important; box-shadow: 0 12px 32px rgba(15,76,129,0.10); }

        .team-card { transition: transform 0.22s, box-shadow 0.22s; }
        .team-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(15,76,129,0.12); }

        .faq-row { cursor: pointer; transition: background 0.18s; border-radius: 10px; }
        .faq-row:hover { background: ${C.light}; }

        .cta-btn { transition: transform 0.18s, box-shadow 0.18s; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(232,71,42,0.35); }
        .cta-btn-sec { transition: background 0.18s; }
        .cta-btn-sec:hover { background: ${C.light} !important; }

        @media (max-width: 639px) {
          .hero-heading { font-size: clamp(28px, 8vw, 40px) !important; }
          .stats-grid   { grid-template-columns: 1fr 1fr !important; }
          .values-grid  { grid-template-columns: 1fr !important; }
          .team-grid    { grid-template-columns: 1fr 1fr !important; }
          .two-col      { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .hero-heading { font-size: clamp(36px, 6vw, 52px) !important; }
          .stats-grid   { grid-template-columns: repeat(2, 1fr) !important; }
          .values-grid  { grid-template-columns: repeat(2, 1fr) !important; }
          .team-grid    { grid-template-columns: repeat(3, 1fr) !important; }
          .two-col      { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 1024px) {
          .hero-heading { font-size: clamp(44px, 4.5vw, 64px) !important; }
          .stats-grid   { grid-template-columns: repeat(4, 1fr) !important; }
          .values-grid  { grid-template-columns: repeat(4, 1fr) !important; }
          .team-grid    { grid-template-columns: repeat(3, 1fr) !important; }
          .two-col      { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── AlertBar ── */}
      <AlertBar C={{ accent: "#ff4d4f" }} />

      {/* ── TopTicker ── */}
      <TopTicker C={C} gutter={gutter} isMobile={isMobile} isDesktop={isDesktop} />

      {/* ── Navbar ── */}
      <Navbar bp={bp} onMenuOpen={() => {}} />

      {/* ════════════════════════════════════
          HERO
      ════════════════════════════════════ */}
      <section style={{ width: "100%", background: `linear-gradient(135deg, ${C.primary} 0%, #1565c0 55%, #0d47a1 100%)`, color: "#fff", padding: isMobile ? "52px 0 44px" : "72px 0 60px", position: "relative", overflow: "hidden" }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -40, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        <div style={{ width: "100%", padding: `0 ${gutter}`, boxSizing: "border-box" }}>
          <Reveal>
            <div style={{ maxWidth: 720 }}>
              {/* Breadcrumb */}
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
                <a href="/" style={{ color: "rgba(255,255,255,0.55)" }}>Home</a>
                <span>›</span>
                <span style={{ color: "#fff" }}>About Us</span>
              </div>

              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "5px 14px", marginBottom: 20 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em" }}>India's #1 Fresher Job Portal</span>
              </div>

              <h1 className="hero-heading" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, lineHeight: 1.15, marginBottom: 18 }}>
                Connecting India's Freshers<br />
                to Their <span style={{ color: C.gold }}>Dream Careers</span>
              </h1>

              <p style={{ fontSize: isMobile ? 14 : 15.5, opacity: 0.85, lineHeight: 1.8, marginBottom: 32, maxWidth: 580 }}>
                CodeTechniques was built with one mission — to make the job search easier, faster and completely free for every fresher in India. No premium walls. No fake listings. Just real opportunities, updated every day.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="/jobs" style={{ background: C.accent, color: "#fff", padding: isMobile ? "10px 22px" : "12px 28px", borderRadius: 9, fontWeight: 700, fontFamily: "'Syne', sans-serif", fontSize: 13 }} className="cta-btn">
                  Browse Jobs →
                </a>
                <a href="/contact" style={{ background: "rgba(255,255,255,0.12)", color: "#fff", padding: isMobile ? "10px 22px" : "12px 28px", borderRadius: 9, fontWeight: 600, fontSize: 13, border: "1px solid rgba(255,255,255,0.25)" }} className="cta-btn-sec">
                  Contact Us
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════
          STATS
      ════════════════════════════════════ */}
      <section style={{ width: "100%", background: "#fff", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: "100%", padding: `0 ${gutter}`, boxSizing: "border-box" }}>
          <div className="stats-grid" style={{ display: "grid", gap: 0 }}>
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div className="stat-card" style={{
                  padding: isMobile ? "28px 16px" : "36px 24px", textAlign: "center",
                  borderRight: i < STATS.length - 1 ? `1px solid ${C.border}` : "none",
                  cursor: "default",
                }}>
                  <div style={{ fontSize: isMobile ? 28 : 34, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? 26 : 34, fontWeight: 800, color: C.primary, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 6, fontWeight: 500 }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          OUR STORY
      ════════════════════════════════════ */}
      <section style={{ width: "100%", padding: isMobile ? "52px 0" : "80px 0" }}>
        <div style={{ width: "100%", padding: `0 ${gutter}`, boxSizing: "border-box" }}>
          <div className="two-col" style={{ display: "grid", gap: isMobile ? 36 : 60, alignItems: "center" }}>
            {/* Left */}
            <Reveal delay={0}>
              <div>
                <SectionLabel>Our Story</SectionLabel>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? 26 : 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 18, color: C.text }}>
                  Built by freshers,<br /><span style={{ color: C.primary }}>for freshers.</span>
                </h2>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.85, marginBottom: 16 }}>
                  In 2019, our founder Ravi Kumar graduated with an engineering degree and spent 4 months applying to jobs on portals that showed outdated listings, charged for "premium access" and never replied. He built CodeTechniques in his hostel room to solve exactly that problem.
                </p>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.85, marginBottom: 16 }}>
                  Today, CodeTechniques is India's most-trusted fresher job portal — powered by a small, passionate team and trusted by over 2.3 lakh candidates who landed their first jobs through us.
                </p>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.85 }}>
                  We list only verified jobs from real companies. Every posting is reviewed manually before it goes live. We don't sell your data. We don't charge you anything. Ever.
                </p>
              </div>
            </Reveal>

            {/* Right — Timeline */}
            <Reveal delay={0.15}>
              <Card style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ background: C.primary, padding: "16px 22px" }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#fff", letterSpacing: "0.08em" }}>OUR JOURNEY</span>
                </div>
                <div style={{ padding: "8px 0" }}>
                  {MILESTONES.map((m, i) => (
                    <div key={m.year} style={{ display: "flex", gap: 16, padding: "14px 22px", borderBottom: i < MILESTONES.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "flex-start" }}>
                      <div style={{ flexShrink: 0, background: i === MILESTONES.length - 1 ? C.accent : C.light, color: i === MILESTONES.length - 1 ? "#fff" : C.primary, borderRadius: 8, padding: "4px 10px", fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 800, minWidth: 48, textAlign: "center" }}>
                        {m.year}
                      </div>
                      <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, margin: 0 }}>{m.event}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          OUR VALUES
      ════════════════════════════════════ */}
      <section style={{ width: "100%", background: "#fff", padding: isMobile ? "52px 0" : "80px 0" }}>
        <div style={{ width: "100%", padding: `0 ${gutter}`, boxSizing: "border-box" }}>
          <Reveal>
            <SectionLabel>What We Stand For</SectionLabel>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? 24 : 34, fontWeight: 800, color: C.text, marginBottom: 36 }}>
              Our Core Values
            </h2>
          </Reveal>
          <div className="values-grid" style={{ display: "grid", gap: 16 }}>
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="val-card" style={{ background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 24, height: "100%", cursor: "default" }}>
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{v.icon}</div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 10 }}>{v.title}</h3>
                  <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75 }}>{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          TEAM
      ════════════════════════════════════ */}
      <section style={{ width: "100%", padding: isMobile ? "52px 0" : "80px 0" }}>
        <div style={{ width: "100%", padding: `0 ${gutter}`, boxSizing: "border-box" }}>
          <Reveal>
            <SectionLabel>The People Behind It</SectionLabel>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? 24 : 34, fontWeight: 800, color: C.text, marginBottom: 36 }}>
              Meet the Team
            </h2>
          </Reveal>
          <div className="team-grid" style={{ display: "grid", gap: 16 }}>
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.07}>
                <div className="team-card" style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, textAlign: "center", cursor: "default" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: m.bg, color: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, margin: "0 auto 14px", border: `2px solid ${m.color}22` }}>
                    {m.initials}
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14.5, color: C.text, marginBottom: 5 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{m.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          WHY CODETECHNIQUES — dark banner
      ════════════════════════════════════ */}
      <section style={{ width: "100%", background: C.text, color: "#fff", padding: isMobile ? "52px 0" : "80px 0" }}>
        <div style={{ width: "100%", padding: `0 ${gutter}`, boxSizing: "border-box" }}>
          <div className="two-col" style={{ display: "grid", gap: isMobile ? 36 : 60, alignItems: "center" }}>
            <Reveal>
              <div>
                <SectionLabel>Why Choose Us</SectionLabel>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? 24 : 34, fontWeight: 800, lineHeight: 1.2, marginBottom: 18 }}>
                  We're different from<br /><span style={{ color: C.gold }}>every other portal.</span>
                </h2>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.85 }}>
                  Most job portals are built for HR teams and recruiters. We're built for the 22-year-old sitting in a tier-2 city, checking his phone at 7 AM before anyone else wakes up — hoping today is the day.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  ["✅", "100% manually verified listings — no bots, no scrapers"],
                  ["📱", "WhatsApp & email alerts the moment a new job drops"],
                  ["🆓", "Completely free — no premium tier, no hidden fees"],
                  ["🎯", "Filtered for freshers — 0 to 3 years experience only"],
                  ["📍", "City-wise listings — Tier 1, Tier 2, and WFH options"],
                  ["🏛️", "Govt job notifications alongside private sector roles"],
                ].map(([icon, text]) => (
                  <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                    <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.65 }}>{text}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          FAQ
      ════════════════════════════════════ */}
      <section style={{ width: "100%", background: "#fff", padding: isMobile ? "52px 0" : "80px 0" }}>
        <div style={{ width: "100%", padding: `0 ${gutter}`, boxSizing: "border-box" }}>
          <Reveal>
            <SectionLabel>Got Questions?</SectionLabel>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? 24 : 34, fontWeight: 800, color: C.text, marginBottom: 32 }}>
              Frequently Asked Questions
            </h2>
          </Reveal>
          <div style={{ maxWidth: 780 }}>
            {FAQS.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 0.05}>
                <div
                  className="faq-row"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ padding: "18px 16px", marginBottom: 4, cursor: "pointer" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: isMobile ? 13.5 : 14.5, color: C.text, flex: 1 }}>{faq.q}</span>
                    <span style={{ color: C.primary, fontSize: 20, fontWeight: 300, flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
                  </div>
                  {openFaq === i && (
                    <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.8, marginTop: 12, paddingRight: 32 }}>
                      {faq.a}
                    </p>
                  )}
                </div>
                <div style={{ height: 1, background: C.border }} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CTA STRIP
      ════════════════════════════════════ */}
      <section style={{ width: "100%", background: `linear-gradient(135deg, ${C.accent}, #c0392b)`, padding: isMobile ? "44px 0" : "64px 0" }}>
        <div style={{ width: "100%", padding: `0 ${gutter}`, boxSizing: "border-box", textAlign: "center" }}>
          <Reveal>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? 22 : 32, fontWeight: 800, color: "#fff", marginBottom: 12 }}>
              Ready to find your first job?
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", marginBottom: 28 }}>
              Join 2.3 lakh+ freshers who found their careers through CodeTechniques — completely free.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/jobs" style={{ background: "#fff", color: C.accent, padding: isMobile ? "11px 24px" : "13px 32px", borderRadius: 9, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13 }} className="cta-btn">
                Browse Jobs →
              </a>
              <a href="#" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: isMobile ? "11px 24px" : "13px 32px", borderRadius: 9, fontWeight: 600, fontSize: 13, border: "1px solid rgba(255,255,255,0.3)" }} className="cta-btn-sec">
                📱 Get WhatsApp Alerts
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