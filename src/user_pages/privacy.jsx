import { useState, useEffect, useRef } from "react";
import AlertBar from "../components/alertbar";
import TopTicker from "../components/topticker";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

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

/* ── Scroll-reveal ── */
function useInView(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ── Table of Contents ── */
const SECTIONS = [
  { id: "overview",        label: "Overview" },
  { id: "data-collected",  label: "Data We Collect" },
  { id: "how-we-use",      label: "How We Use It" },
  { id: "cookies",         label: "Cookies & Tracking" },
  { id: "sharing",         label: "Data Sharing" },
  { id: "security",        label: "Data Security" },
  { id: "your-rights",     label: "Your Rights" },
  { id: "third-parties",   label: "Third-Party Links" },
  { id: "children",        label: "Children's Privacy" },
  { id: "changes",         label: "Policy Changes" },
  { id: "contact",         label: "Contact Us" },
];

/* ── Shared primitives ── */
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

function SectionTitle({ id, children }) {
  return (
    <h2 id={id} style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 16, paddingTop: 8, scrollMarginTop: 80 }}>
      {children}
    </h2>
  );
}

function Para({ children }) {
  return <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.85, marginBottom: 14 }}>{children}</p>;
}

function BulletList({ items }) {
  return (
    <ul style={{ paddingLeft: 0, listStyle: "none", marginBottom: 16 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary, flexShrink: 0, marginTop: 7 }} />
          <span style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoBox({ icon, title, children, bg = "#e8f4fd", border = "#bdd6f0", color = C.primary }) {
  return (
    <div style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 12, padding: 18, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13.5, color }}>{title}</span>
      </div>
      <div style={{ fontSize: 13.5, color: C.text, lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: C.border, margin: "32px 0" }} />;
}

/* ════════════════════════════════════════════ */
export default function Privacy() {
  const bp = useBreakpoint();
  const { isMobile, isTablet, isDesktop } = bp;
  const gutter = isMobile ? "16px" : isTablet ? "20px" : "32px";
  const [activeSection, setActiveSection] = useState("overview");

  /* Highlight active ToC item on scroll */
  useEffect(() => {
    const handleScroll = () => {
      for (const sec of [...SECTIONS].reverse()) {
        const el = document.getElementById(sec.id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(sec.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ width: "100%", overflowX: "hidden", fontFamily: "'DM Sans', sans-serif", background: C.light, color: C.text, minHeight: "100vh" }}>
      <style>{`
       @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100% !important; margin: 0 !important; overflow-x: hidden !important; background: ${C.light} !important; }
        #root { width: 100% !important; overflow-x: hidden !important; }
        a { text-decoration: none; color: inherit; }

        .toc-link { transition: color 0.18s, padding-left 0.18s; cursor: pointer; }
        .toc-link:hover { color: ${C.primary} !important; padding-left: 4px; }
        .toc-link.active { color: ${C.primary} !important; font-weight: 700 !important; }

        @media (max-width: 1023px) {
          .page-layout { grid-template-columns: 1fr !important; }
          .toc-sidebar  { display: none !important; }
        }
      `}</style>

      {/* ── Top components ── */}
      <AlertBar C={{ accent: "#ff4d4f" }} />
      <TopTicker C={C} gutter={gutter} isMobile={isMobile} isDesktop={isDesktop} />
      <Navbar bp={bp} onMenuOpen={() => {}} />

      {/* ════════════════════════════════════
          HERO
      ════════════════════════════════════ */}
      <section style={{ width: "100%", background: `linear-gradient(135deg, ${C.primary} 0%, #1565c0 55%, #0d47a1 100%)`, color: "#fff", padding: isMobile ? "48px 0 40px" : "64px 0 52px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -40, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        <div style={{ width: "100%", padding: `0 ${gutter}`, boxSizing: "border-box" }}>
          <Reveal>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
              <a href="/" style={{ color: "rgba(255,255,255,0.5)" }}>Home</a>
              <span>›</span>
              <span style={{ color: "#fff" }}>Privacy Policy</span>
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "5px 14px", marginBottom: 18 }}>
              <span style={{ fontSize: 14 }}>🔒</span>
              <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em" }}>Last updated: March 2026</span>
            </div>

            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "clamp(26px,8vw,36px)" : "clamp(36px,4vw,52px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 14 }}>
              Privacy Policy
            </h1>

            <p style={{ fontSize: isMobile ? 13.5 : 15, opacity: 0.82, lineHeight: 1.75, maxWidth: 560 }}>
              We believe privacy is a right, not a feature. This policy explains exactly what data we collect, why we collect it, and how you can control it — in plain English, not legalese.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════
          QUICK SUMMARY CARDS
      ════════════════════════════════════ */}
      <section style={{ width: "100%", background: "#fff", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: "100%", padding: `28px ${gutter}`, boxSizing: "border-box" }}>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12 }}>
              {[
                { icon: "🚫", title: "We don't sell data", sub: "Never sold to advertisers" },
                { icon: "🆓", title: "Always free", sub: "No paid data tiers" },
                { icon: "✏️", title: "Edit anytime", sub: "Update or delete your info" },
                { icon: "📧", title: "Opt-out easy", sub: "Unsubscribe in one click" },
              ].map(c => (
                <div key={c.title} style={{ background: C.light, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{c.icon}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 3 }}>{c.title}</div>
                  <div style={{ fontSize: 11.5, color: C.muted }}>{c.sub}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════
          MAIN CONTENT + STICKY TOC
      ════════════════════════════════════ */}
      <section style={{ width: "100%", padding: isMobile ? "36px 0 60px" : "52px 0 80px" }}>
        <div style={{ width: "100%", padding: `0 ${gutter}`, boxSizing: "border-box" }}>
          <div className="page-layout" style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 40, alignItems: "flex-start" }}>

            {/* ── MAIN CONTENT ── */}
            <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${C.border}`, padding: isMobile ? 22 : 36 }}>
              <SectionLabel>Privacy Policy</SectionLabel>
              <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.8, marginBottom: 32 }}>
                This Privacy Policy applies to <strong style={{ color: C.text }}>CodeTechniques</strong> ("we", "our", "us") and covers all services accessible at codetechniques.in and our mobile applications. By using our platform, you agree to the practices described here.
              </p>

              {/* 1. OVERVIEW */}
              <Reveal>
                <SectionTitle id="overview">1. Overview</SectionTitle>
                <Para>
                  CodeTechniques is a free job portal for freshers in India. Our core mission is to connect job-seekers with verified opportunities — and doing that well requires collecting some basic information. We take our responsibility to handle that information carefully very seriously.
                </Para>
                <InfoBox icon="✅" title="Our core commitment" bg="#f0fff4" border="#86efac" color={C.green}>
                  We will never sell, rent, or trade your personal data to third parties for commercial or advertising purposes. Period.
                </InfoBox>
                <Divider />
              </Reveal>

              {/* 2. DATA COLLECTED */}
              <Reveal>
                <SectionTitle id="data-collected">2. Data We Collect</SectionTitle>
                <Para>We collect only what we need to provide you with a useful, personalised job-search experience.</Para>

                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10, marginTop: 20 }}>Information you provide directly</h3>
                <BulletList items={[
                  "Name and email address (when you sign up or submit the contact form)",
                  "Phone number (optional — only if you provide it)",
                  "Resume / CV (only if you choose to upload it)",
                  "Job preferences: location, category, work mode, expected salary",
                  "Profile information: education, graduation year, skills",
                ]} />

                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10, marginTop: 20 }}>Information collected automatically</h3>
                <BulletList items={[
                  "Device type, browser, and operating system",
                  "Pages visited, time spent, and clicks (via Google Analytics)",
                  "IP address and approximate city-level location",
                  "Referring URL (what site you came from)",
                  "Job listings you viewed, saved, or applied to",
                ]} />

                <InfoBox icon="📋" title="What we do NOT collect" bg="#fff8e1" border="#fcd9aa" color="#92400e">
                  We do not collect Aadhaar numbers, PAN details, bank account information, passwords from other sites, or any sensitive personal data under IT Act definitions.
                </InfoBox>
                <Divider />
              </Reveal>

              {/* 3. HOW WE USE IT */}
              <Reveal>
                <SectionTitle id="how-we-use">3. How We Use Your Data</SectionTitle>
                <Para>Every piece of data we collect has a specific, limited purpose:</Para>
                <BulletList items={[
                  "Show you personalised job recommendations matching your profile",
                  "Send job alert emails and WhatsApp notifications (only with your consent)",
                  "Allow you to save jobs and track your applications",
                  "Verify and improve the quality of our job listings",
                  "Respond to your support and contact form queries",
                  "Prevent fraud, spam accounts, and fake job postings",
                  "Analyse platform usage to fix bugs and improve features",
                  "Comply with applicable Indian laws and regulations",
                ]} />
                <Para>
                  We use your data only for the purposes listed above. If we ever want to use it for anything new, we will update this policy and notify you before doing so.
                </Para>
                <Divider />
              </Reveal>

              {/* 4. COOKIES */}
              <Reveal>
                <SectionTitle id="cookies">4. Cookies &amp; Tracking</SectionTitle>
                <Para>
                  We use cookies and similar technologies to make the platform work properly and to understand how people use it.
                </Para>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  {[
                    { type: "Essential Cookies", desc: "Required for login sessions, saved jobs, and security. Cannot be disabled.", color: C.primary, bg: "#e8f4fd" },
                    { type: "Analytics Cookies", desc: "Google Analytics — helps us understand which pages are most useful. Can be opted out.", color: "#7c3aed", bg: "#ede9fe" },
                    { type: "Preference Cookies", desc: "Remembers your location, category filters, and display preferences.", color: C.green, bg: "#f0fff4" },
                    { type: "Marketing Cookies", desc: "We do not use marketing / retargeting cookies. No ad networks track you here.", color: C.accent, bg: "#fff0f0" },
                  ].map(c => (
                    <div key={c.type} style={{ background: c.bg, borderRadius: 10, padding: "14px 16px", border: `1px solid ${c.color}22` }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12.5, color: c.color, marginBottom: 6 }}>{c.type}</div>
                      <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65 }}>{c.desc}</div>
                    </div>
                  ))}
                </div>

                <Para>
                  You can disable non-essential cookies at any time through your browser settings. Note that disabling essential cookies may affect your ability to log in and use certain features.
                </Para>
                <Divider />
              </Reveal>

              {/* 5. SHARING */}
              <Reveal>
                <SectionTitle id="sharing">5. Data Sharing</SectionTitle>
                <Para>We do not sell your personal data. We share it only in the following limited, necessary circumstances:</Para>
                <BulletList items={[
                  "With employers — only your name and contact details when you explicitly click 'Apply Now' on a listing",
                  "With service providers — hosting (AWS), email delivery (SendGrid), analytics (Google). All are bound by strict data processing agreements",
                  "With law enforcement — only when required by a valid court order or applicable Indian law",
                  "In a business transfer — if CodeTechniques is acquired, your data may transfer to the new owner under the same privacy terms",
                ]} />
                <InfoBox icon="🛡️" title="Your apply data is controlled" bg="#e8f4fd" border="#bdd6f0" color={C.primary}>
                  When you apply to a job, only the data you choose to share with that employer is transmitted. We don't expose your full profile or search history to companies.
                </InfoBox>
                <Divider />
              </Reveal>

              {/* 6. SECURITY */}
              <Reveal>
                <SectionTitle id="security">6. Data Security</SectionTitle>
                <Para>
                  We implement industry-standard technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction.
                </Para>
                <BulletList items={[
                  "All data is transmitted over HTTPS / TLS 1.3 encryption",
                  "Passwords are hashed using bcrypt with a salt factor of 12",
                  "Databases are protected behind VPC with no public access",
                  "Access to production data is restricted to 2 engineers and requires 2FA",
                  "We perform regular security audits and penetration tests",
                  "Backups are encrypted and stored in a separate geographic region",
                ]} />
                <Para>
                  Despite these measures, no method of transmission over the internet is 100% secure. If you suspect any unauthorised access to your account, contact us immediately at security@codetechniques.in.
                </Para>
                <Divider />
              </Reveal>

              {/* 7. YOUR RIGHTS */}
              <Reveal>
                <SectionTitle id="your-rights">7. Your Rights</SectionTitle>
                <Para>Under India's Digital Personal Data Protection Act 2023 (DPDPA) and general privacy principles, you have the following rights:</Para>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {[
                    { icon: "👁️", right: "Right to Access", desc: "Request a copy of all personal data we hold about you" },
                    { icon: "✏️", right: "Right to Correction", desc: "Ask us to update or correct inaccurate information" },
                    { icon: "🗑️", right: "Right to Erasure", desc: "Request deletion of your account and associated data" },
                    { icon: "📦", right: "Right to Portability", desc: "Receive your data in a machine-readable format (JSON/CSV)" },
                    { icon: "🚫", right: "Right to Object", desc: "Opt out of marketing emails, WhatsApp alerts, or analytics" },
                    { icon: "⏸️", right: "Right to Restriction", desc: "Ask us to stop processing your data in specific ways" },
                  ].map(r => (
                    <div key={r.right} style={{ display: "flex", gap: 12, padding: "12px 16px", background: C.light, borderRadius: 10, border: `1px solid ${C.border}`, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{r.icon}</span>
                      <div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13.5, color: C.text, marginBottom: 3 }}>{r.right}</div>
                        <div style={{ fontSize: 13, color: C.muted }}>{r.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Para>
                  To exercise any of these rights, email <strong style={{ color: C.primary }}>privacy@codetechniques.in</strong> with your registered email address. We will respond within 30 days.
                </Para>
                <Divider />
              </Reveal>

              {/* 8. THIRD PARTIES */}
              <Reveal>
                <SectionTitle id="third-parties">8. Third-Party Links</SectionTitle>
                <Para>
                  Our platform contains links to external job listings on company career pages, LinkedIn, Naukri, and other sites. Once you leave CodeTechniques, this Privacy Policy no longer applies.
                </Para>
                <Para>
                  We are not responsible for the privacy practices of third-party websites. We recommend reviewing the privacy policy of any external site you visit through our platform.
                </Para>
                <Divider />
              </Reveal>

              {/* 9. CHILDREN */}
              <Reveal>
                <SectionTitle id="children">9. Children's Privacy</SectionTitle>
                <Para>
                  CodeTechniques is intended for users who are 18 years of age or older. We do not knowingly collect personal data from anyone under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at privacy@codetechniques.in and we will delete that information promptly.
                </Para>
                <Divider />
              </Reveal>

              {/* 10. CHANGES */}
              <Reveal>
                <SectionTitle id="changes">10. Policy Changes</SectionTitle>
                <Para>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other operational reasons. When we make material changes, we will:
                </Para>
                <BulletList items={[
                  "Update the 'Last Updated' date at the top of this page",
                  "Send an email notification to all registered users",
                  "Display a prominent notice on our homepage for 30 days",
                ]} />
                <Para>
                  Your continued use of CodeTechniques after the effective date of any changes constitutes your acceptance of the revised policy. We encourage you to review this page periodically.
                </Para>
                <Divider />
              </Reveal>

              {/* 11. CONTACT */}
              <Reveal>
                <SectionTitle id="contact">11. Contact Us</SectionTitle>
                <Para>If you have any questions, concerns, or requests about this Privacy Policy or how we handle your data, you can reach us through any of the following channels:</Para>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {[
                    { icon: "📧", label: "Privacy email", value: "privacy@codetechniques.in" },
                    { icon: "📧", label: "General contact", value: "hello@codetechniques.in" },
                    { icon: "📍", label: "Postal address", value: "3rd Floor, Tech Park, Hitech City, Hyderabad — 500081, Telangana, India" },
                  ].map(c => (
                    <div key={c.label} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 16px", background: "#e8f4fd", borderRadius: 10, border: "1px solid #bdd6f0" }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{c.icon}</span>
                      <div>
                        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, color: C.muted, marginBottom: 3 }}>{c.label}</div>
                        <div style={{ fontSize: 13.5, color: C.primary, fontWeight: 500 }}>{c.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <InfoBox icon="⏱️" title="Response commitment" bg="#f0fff4" border="#86efac" color={C.green}>
                  We aim to respond to all privacy-related queries within 7 business days. Urgent data breach reports are handled within 24 hours.
                </InfoBox>
              </Reveal>
            </div>

            {/* ── STICKY TABLE OF CONTENTS (desktop only) ── */}
            <div className="toc-sidebar" style={{ position: "sticky", top: 80 }}>
              <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${C.border}`, padding: 20 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, color: C.text, marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
                  📋 Contents
                </div>
                <nav>
                  {SECTIONS.map(sec => (
                    <div
                      key={sec.id}
                      className={`toc-link ${activeSection === sec.id ? "active" : ""}`}
                      onClick={() => scrollToSection(sec.id)}
                      style={{ fontSize: 12.5, color: activeSection === sec.id ? C.primary : C.muted, padding: "7px 0", borderBottom: `1px solid ${C.border}`, display: "block", fontWeight: activeSection === sec.id ? 700 : 400 }}
                    >
                      {sec.label}
                    </div>
                  ))}
                </nav>

                {/* Last updated */}
                <div style={{ marginTop: 16, padding: "10px 12px", background: C.light, borderRadius: 8, fontSize: 11.5, color: C.muted, textAlign: "center" }}>
                  Last updated<br />
                  <strong style={{ color: C.text }}>March 18, 2026</strong>
                </div>
              </div>

              {/* Download PDF placeholder */}
              <div style={{ background: C.primary, borderRadius: 14, padding: 18, marginTop: 14, textAlign: "center", color: "#fff" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Download PDF</div>
                <div style={{ fontSize: 11.5, opacity: 0.7, marginBottom: 14 }}>Save this policy for your records</div>
                <button
                  onClick={() => window.print()}
                  style={{ background: "#fff", color: C.primary, border: "none", padding: "8px 18px", borderRadius: 8, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                >
                  Print / Save →
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          BOTTOM CTA
      ════════════════════════════════════ */}
      <section style={{ width: "100%", background: C.text, color: "#fff", padding: isMobile ? "44px 0" : "60px 0" }}>
        <div style={{ width: "100%", padding: `0 ${gutter}`, boxSizing: "border-box", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontSize: 36, marginBottom: 14 }}>🔒</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? 20 : 28, fontWeight: 800, marginBottom: 10 }}>
              Your privacy matters to us
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
              Questions about how we handle your data? Our team is happy to walk you through anything in this policy.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/contact" style={{ background: C.accent, color: "#fff", padding: "12px 28px", borderRadius: 9, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13 }}>
                Contact Us →
              </a>
              <a href="mailto:privacy@codetechniques.in" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "12px 28px", borderRadius: 9, fontWeight: 600, fontSize: 13, border: "1px solid rgba(255,255,255,0.2)" }}>
                Email Privacy Team
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