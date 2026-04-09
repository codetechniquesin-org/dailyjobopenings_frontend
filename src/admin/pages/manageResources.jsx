import { useEffect, useState } from "react";
import AdminNavbar from "../components/adminnavbar";
import API_BASE_URL  from "../../config/api";

/* ── Tokens ── */
const S = {
  cream: "#EDE2D0", creamDark: "#D4C4B0", creamDeep: "#C2AF97",
  white: "#FAF6F0", plum: "#3D1A47", plumMid: "#5A2B6E",
  plumLight: "#7B4A8B", text: "#1e0d26", muted: "#6b5778", border: "#D4C4B0",
};

const TYPES   = ["PDF", "DOC"];
const LEVELS  = ["Beginner", "Intermediate", "Advanced"];
const ICONS   = ["📄", "📘", "📗", "📙", "📕", "📓", "📑", "🗂️"];
const COLORS  = ["#3D1A47", "#5A2B6E", "#7B4A8B", "#C2AF97", "#7A5C3A", "#2D4A6E", "#1A5C3A", "#6E3A1A"];

const EMPTY = { title: "", desc: "", type: "PDF", category: "", pages: "", size: "", color: COLORS[0], icon: "📄", level: "Beginner", fileUrl: "" };

const getToken = () =>
  localStorage.getItem("res.data.token") ||
  JSON.parse(localStorage.getItem("adminInfo"))?.token;

const API = `${API_BASE_URL}/api`;
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

const levelStyle = {
  Beginner:     { bg: "rgba(61,26,71,0.08)",   color: S.plum      },
  Intermediate: { bg: "rgba(194,175,151,0.35)", color: "#7A5C3A"   },
  Advanced:     { bg: "rgba(90,43,110,0.12)",   color: S.plumMid   },
};
const typeStyle = {
  PDF: { bg: "rgba(220,38,38,0.08)", color: "#b91c1c" },
  DOC: { bg: "rgba(37,99,235,0.08)", color: "#1d4ed8" },
};

/* ── Reusables ── */
const FieldLabel = ({ children }) => (
  <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: S.muted, display: "block", marginBottom: 7 }}>{children}</label>
);

const inp = { width: "100%", padding: "10px 13px", fontSize: 13.5, border: `1.5px solid ${S.border}`, borderRadius: 10, fontFamily: "'DM Sans',sans-serif", color: S.text, background: S.cream, outline: "none", boxSizing: "border-box" };

const Btn = ({ children, onClick, variant = "primary", disabled, style = {} }) => {
  const v = {
    primary: { background: S.plum,   color: S.cream,  border: "none" },
    ghost:   { background: "transparent", color: S.plum, border: `1.5px solid ${S.border}` },
    danger:  { background: "rgba(220,38,38,0.09)", color: "#b91c1c", border: "1.5px solid rgba(220,38,38,0.22)" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ padding: "10px 22px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: disabled ? 0.5 : 1, letterSpacing: "0.3px", transition: "opacity .2s, transform .15s", ...v[variant], ...style }}>
      {children}
    </button>
  );
};

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(30,13,38,0.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}>
      <div style={{ background: S.white, borderRadius: 18, padding: "30px 28px", width: "100%", maxWidth: 520, border: `1px solid ${S.border}`, boxShadow: "0 24px 64px rgba(61,26,71,0.18)", margin: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 22, color: S.plum, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "rgba(61,26,71,0.07)", border: "none", width: 30, height: 30, borderRadius: "50%", fontSize: 14, cursor: "pointer", color: S.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast.msg) return null;
  return (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 300, background: S.white, border: `1px solid ${S.border}`, borderLeft: `4px solid ${toast.type === "err" ? "#b91c1c" : S.plum}`, borderRadius: 12, padding: "13px 20px", fontSize: 13.5, fontWeight: 500, boxShadow: "0 8px 28px rgba(61,26,71,0.13)", color: toast.type === "err" ? "#b91c1c" : S.plum, display: "flex", alignItems: "center", gap: 10 }}>
      <span>{toast.type === "err" ? "✕" : "✓"}</span> {toast.msg}
    </div>
  );
}

/* ── Resource Form (shared by Create & Edit) ── */
function ResourceForm({ form, onChange }) {
  const row = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <FieldLabel>Title</FieldLabel>
        <input style={inp} value={form.title} onChange={e => onChange("title", e.target.value)} placeholder="Resource title" />
      </div>
      <div>
        <FieldLabel>Description</FieldLabel>
        <textarea style={{ ...inp, resize: "vertical", minHeight: 72, lineHeight: 1.6 }} value={form.desc} onChange={e => onChange("desc", e.target.value)} placeholder="Brief description" />
      </div>
      <div style={row}>
        <div>
          <FieldLabel>Category</FieldLabel>
          <input style={inp} value={form.category} onChange={e => onChange("category", e.target.value)} placeholder="e.g. Design" />
        </div>
        <div>
          <FieldLabel>Type</FieldLabel>
          <select style={{ ...inp, appearance: "none", cursor: "pointer" }} value={form.type} onChange={e => onChange("type", e.target.value)}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div style={row}>
        <div>
          <FieldLabel>Level</FieldLabel>
          <select style={{ ...inp, appearance: "none", cursor: "pointer" }} value={form.level} onChange={e => onChange("level", e.target.value)}>
            {LEVELS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <FieldLabel>Pages</FieldLabel>
          <input style={inp} type="number" value={form.pages} onChange={e => onChange("pages", e.target.value)} placeholder="e.g. 42" />
        </div>
      </div>
      <div style={row}>
        <div>
          <FieldLabel>Size</FieldLabel>
          <input style={inp} value={form.size} onChange={e => onChange("size", e.target.value)} placeholder="e.g. 2.4 MB" />
        </div>
        <div>
          <FieldLabel>File URL</FieldLabel>
          <input style={inp} value={form.fileUrl} onChange={e => onChange("fileUrl", e.target.value)} placeholder="https://..." />
        </div>
      </div>
      {/* Icon picker */}
      <div>
        <FieldLabel>Icon</FieldLabel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {ICONS.map(ic => (
            <button key={ic} type="button" onClick={() => onChange("icon", ic)}
              style={{ width: 38, height: 38, borderRadius: 9, border: `2px solid ${form.icon === ic ? S.plum : S.border}`, background: form.icon === ic ? "rgba(61,26,71,0.09)" : "transparent", fontSize: 18, cursor: "pointer", transition: "border-color .15s" }}>
              {ic}
            </button>
          ))}
        </div>
      </div>
      {/* Color picker */}
      <div>
        <FieldLabel>Card Accent</FieldLabel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {COLORS.map(cl => (
            <button key={cl} type="button" onClick={() => onChange("color", cl)}
              style={{ width: 28, height: 28, borderRadius: "50%", background: cl, border: `3px solid ${form.color === cl ? S.text : "transparent"}`, cursor: "pointer", transition: "border-color .15s" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function ManageResources() {
  const [resources,   setResources]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [toast,       setToast]       = useState({ msg: "", type: "ok" });
  const [confirm,     setConfirm]     = useState(null);   // resource to delete
  const [editRes,     setEditRes]     = useState(null);   // resource being edited
  const [createOpen,  setCreateOpen]  = useState(false);
  const [form,        setForm]        = useState(EMPTY);

  const showToast = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast({ msg: "", type: "ok" }), 3200); };
  const patchForm = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const patchEdit = (k, v) => setEditRes(r => ({ ...r, [k]: v }));

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/resources/get-all-resources`);
      const data = await res.json();
      setResources(Array.isArray(data) ? data : []);
    } catch { setResources([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchResources(); }, []);

  const doCreate = async () => {
    if (!form.title.trim() || !form.desc.trim() || !form.category.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/resources/create-resource`, { method: "POST", headers: authHeaders(), body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast(`"${form.title}" created successfully`);
      setCreateOpen(false); setForm(EMPTY); fetchResources();
    } catch (e) { showToast(e.message, "err"); }
  };

  const doEdit = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/resources/update-resource/${editRes._id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(editRes) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast(`"${editRes.title}" updated successfully`);
      setEditRes(null); fetchResources();
    } catch (e) { showToast(e.message, "err"); }
  };

  const doDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/resources/delete-resource/${confirm._id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast(`"${confirm.title}" deleted`);
      setConfirm(null); fetchResources();
    } catch (e) { showToast(e.message, "err"); setConfirm(null); }
  };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: S.cream, minHeight: "100vh", color: S.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Cormorant+Garamond:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{width:100%!important;margin:0!important;padding:0!important;overflow-x:hidden!important;background:#EDE2D0!important}
        #root{width:100%!important;overflow-x:hidden!important}

        .res-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        @media(max-width:1024px){.res-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.res-grid{grid-template-columns:1fr}}

        .res-card{
          background:${S.white};border:1px solid ${S.border};border-radius:16px;
          overflow:hidden;display:flex;flex-direction:column;
          transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s,border-color .25s;
        }
        .res-card:hover{transform:translateY(-4px);border-color:${S.plumLight};box-shadow:0 12px 32px rgba(61,26,71,0.12)}

        .card-act-btn{
          flex:1;padding:9px 0;font-size:12px;font-weight:600;border:none;
          cursor:pointer;font-family:inherit;letter-spacing:.4px;
          transition:opacity .2s,transform .15s;
        }
        .card-act-btn:hover{opacity:.78;transform:translateY(-1px)}
        input:focus,select:focus,textarea:focus{border-color:${S.plumLight}!important}
        select option{background:${S.white};color:${S.text}}
      `}</style>

      <AdminNavbar />
      <Toast toast={toast} />

      {/* Hero */}
      <div style={{ background: S.plum, color: S.cream, padding: "clamp(24px,4vw,40px) clamp(16px,4vw,40px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: S.creamDeep, marginBottom: 8 }}>Admin · Resources</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 400, letterSpacing: "-0.3px", lineHeight: 1.1, color: S.cream }}>
          Manage <em style={{ fontStyle: "italic", fontWeight: 300, color: S.creamDeep }}>Resources</em>
        </h1>
        <p style={{ marginTop: 10, fontSize: 13, color: "rgba(237,226,208,0.55)" }}>
          {resources.length} resource{resources.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(24px,3vw,36px) clamp(16px,4vw,24px) 60px" }}>

        {/* Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: S.muted, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 20, height: "1.5px", background: S.plumLight, display: "inline-block" }} />
            Library
          </div>
          <button onClick={() => setCreateOpen(true)}
            style={{ background: S.plum, color: S.cream, border: "none", padding: "10px 22px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Resource
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: S.muted, fontSize: 14 }}>Loading resources…</div>
        ) : resources.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 400, color: S.plumLight, marginBottom: 8 }}>No resources yet</div>
            <div style={{ fontSize: 13, color: S.muted }}>Create the first resource to get started.</div>
          </div>
        ) : (
          <div className="res-grid">
            {resources.map(r => {
              const accent = r.color || S.plum;
              const lvl    = levelStyle[r.level] || levelStyle.Beginner;
              const tp     = typeStyle[r.type]   || typeStyle.PDF;
              return (
                <div key={r._id} className="res-card">
                  {/* Colored top bar */}
                  <div style={{ height: 5, background: accent }} />

                  {/* Card body */}
                  <div style={{ padding: "20px 20px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Icon + badges row */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 11, background: `${accent}18`, border: `1.5px solid ${accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                        {r.icon || "📄"}
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".7px", textTransform: "uppercase", padding: "3px 9px", borderRadius: 20, ...tp }}>{r.type}</span>
                        {r.level && <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".7px", textTransform: "uppercase", padding: "3px 9px", borderRadius: 20, ...lvl }}>{r.level}</span>}
                      </div>
                    </div>

                    {/* Title + desc */}
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 500, color: S.plum, lineHeight: 1.2, marginBottom: 6 }}>{r.title}</div>
                      <div style={{ fontSize: 12.5, color: S.muted, lineHeight: 1.65, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{r.desc}</div>
                    </div>

                    {/* Meta row */}
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: "auto", paddingTop: 4 }}>
                      {r.category && <Meta icon="🏷" label={r.category} />}
                      {r.pages    && <Meta icon="📃" label={`${r.pages}p`} />}
                      {r.size     && <Meta icon="💾" label={r.size} />}
                    </div>
                  </div>

                  {/* Action footer */}
                  <div style={{ display: "flex", borderTop: `1px solid ${S.border}` }}>
                    <button className="card-act-btn" onClick={() => setEditRes({ ...r })}
                      style={{ background: "rgba(61,26,71,0.05)", color: S.plum, borderRight: `1px solid ${S.border}` }}>
                      Edit
                    </button>
                    <button className="card-act-btn" onClick={() => setConfirm(r)}
                      style={{ background: "rgba(220,38,38,0.05)", color: "#b91c1c" }}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Create Modal ── */}
      {createOpen && (
        <Modal title="New Resource" onClose={() => { setCreateOpen(false); setForm(EMPTY); }}>
          <div style={{ maxHeight: "65vh", overflowY: "auto", paddingRight: 4 }}>
            <ResourceForm form={form} onChange={patchForm} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
            <Btn onClick={() => { setCreateOpen(false); setForm(EMPTY); }} variant="ghost">Cancel</Btn>
            <Btn onClick={doCreate} disabled={!form.title.trim() || !form.desc.trim() || !form.category.trim()} variant="primary">Create Resource</Btn>
          </div>
        </Modal>
      )}

      {/* ── Edit Modal ── */}
      {editRes && (
        <Modal title="Edit Resource" onClose={() => setEditRes(null)}>
          <div style={{ maxHeight: "65vh", overflowY: "auto", paddingRight: 4 }}>
            <ResourceForm form={editRes} onChange={patchEdit} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
            <Btn onClick={() => setEditRes(null)} variant="ghost">Cancel</Btn>
            <Btn onClick={doEdit} variant="primary">Save Changes</Btn>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {confirm && (
        <Modal title="Delete Resource?" onClose={() => setConfirm(null)}>
          <p style={{ fontSize: 13.5, color: S.muted, lineHeight: 1.8, marginBottom: 6 }}>
            Are you sure you want to delete
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 500, color: S.plum, marginBottom: 24 }}>
            "{confirm.title}"
          </p>
          <p style={{ fontSize: 12.5, color: S.muted, marginBottom: 26 }}>This action cannot be undone.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn onClick={() => setConfirm(null)} variant="ghost">Cancel</Btn>
            <Btn onClick={doDelete} variant="danger">Yes, Delete</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── Meta chip ── */
function Meta({ icon, label }) {
  return (
    <span style={{ fontSize: 11.5, color: S.muted, display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ fontSize: 12 }}>{icon}</span>{label}
    </span>
  );
}