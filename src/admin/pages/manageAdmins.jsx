import { useEffect, useState } from "react";
import AdminNavbar from "../components/adminnavbar";
import API_BASE_URL from "../../config/api";

/* ── Design tokens ── */
const S = {
  cream:      "#EDE2D0",
  creamDark:  "#D4C4B0",
  creamDeep:  "#C2AF97",
  white:      "#FAF6F0",
  plum:       "#3D1A47",
  plumMid:    "#5A2B6E",
  plumLight:  "#7B4A8B",
  text:       "#1e0d26",
  muted:      "#6b5778",
  border:     "#D4C4B0",
};

const ROLES = ["admin", "super_admin"];

const roleStyle = {
  admin:       { bg: "rgba(61,26,71,0.09)",   color: S.plum    },
  super_admin: { bg: "rgba(194,175,151,0.35)", color: "#7A5C3A" },
};

const getToken = () =>
  localStorage.getItem("res.data.token") ||
  JSON.parse(localStorage.getItem("adminInfo"))?.token;

/* ── Modal ── */
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(30,13,38,0.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: S.white, borderRadius: 18, padding: "32px 28px", width: "100%", maxWidth: 440, border: `1px solid ${S.border}`, boxShadow: "0 24px 64px rgba(61,26,71,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 22, color: S.plum, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "rgba(61,26,71,0.07)", border: "none", width: 30, height: 30, borderRadius: "50%", fontSize: 14, cursor: "pointer", color: S.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Shared input style ── */
const inp = {
  width: "100%", padding: "11px 14px", fontSize: 13.5,
  border: `1.5px solid ${S.border}`, borderRadius: 10,
  fontFamily: "'DM Sans', sans-serif", color: S.text,
  background: S.cream, outline: "none", boxSizing: "border-box",
  transition: "border-color .2s",
};

/* ── Button ── */
const Btn = ({ children, onClick, variant = "primary", disabled, style = {} }) => {
  const styles = {
    primary: { background: S.plum,  color: S.cream,  border: "none" },
    ghost:   { background: "transparent", color: S.plum, border: `1.5px solid ${S.border}` },
    danger:  { background: "rgba(220,38,38,0.1)", color: "#b91c1c", border: "1.5px solid rgba(220,38,38,0.25)" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 22px", borderRadius: 10, fontWeight: 600, fontSize: 13,
        cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
        opacity: disabled ? 0.55 : 1, transition: "opacity .2s, transform .15s",
        letterSpacing: "0.3px",
        ...styles[variant], ...style,
      }}
    >
      {children}
    </button>
  );
};

/* ── Label ── */
const FieldLabel = ({ children }) => (
  <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: S.muted, display: "block", marginBottom: 8 }}>
    {children}
  </label>
);

export default function Admins() {
  const [admins,     setAdmins]     = useState([]);
  const [toast,      setToast]      = useState({ msg: "", type: "ok" });
  const [confirm,    setConfirm]    = useState(null);
  const [editAdmin,  setEditAdmin]  = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form,       setForm]       = useState({ email: "", role: "admin" });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "ok" }), 3000);
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/get-all-admins`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setAdmins(data);
    } catch (e) { console.error(e.message); }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const doDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/delete-admin/${confirm}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast("Admin removed successfully");
      setConfirm(null); fetchAdmins();
    } catch (e) { showToast(e.message, "err"); setConfirm(null); }
  };

  const doEdit = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/update-admin/${editAdmin._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ email: editAdmin.email, role: editAdmin.role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast("Admin updated successfully");
      setEditAdmin(null); fetchAdmins();
    } catch (e) { showToast(e.message, "err"); }
  };

  const doCreate = async () => {
    if (!form.email.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/create-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast("Admin created successfully");
      setCreateOpen(false); setForm({ email: "", role: "admin" }); fetchAdmins();
    } catch (e) { showToast(e.message, "err"); }
  };

  const initials = email => email ? email.charAt(0).toUpperCase() : "?";

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: S.cream, minHeight: "100vh", color: S.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Cormorant+Garamond:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; background: #EDE2D0 !important; }
        #root { width: 100% !important; overflow-x: hidden !important; }

        .admin-card {
          background: ${S.white};
          border: 1px solid ${S.border};
          border-radius: 16px;
          padding: clamp(18px, 2vw, 24px);
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          position: relative;
          overflow: hidden;
          transition: transform .3s cubic-bezier(.34,1.56,.64,1), border-color .25s, box-shadow .3s;
        }
        .admin-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 4px;
          background: ${S.plum};
          opacity: 0;
          transition: opacity .25s;
          border-radius: 16px 0 0 16px;
        }
        .admin-card:hover {
          transform: translateY(-2px);
          border-color: ${S.plumLight};
          box-shadow: 0 10px 28px rgba(61,26,71,0.10);
        }
        .admin-card:hover::before { opacity: 1; }

        .act-btn {
          font-size: 12px; font-weight: 600; padding: 8px 16px;
          border-radius: 9px; border: none; cursor: pointer;
          font-family: inherit; letter-spacing: 0.3px;
          transition: opacity .2s, transform .15s;
        }
        .act-btn:hover { opacity: 0.82; transform: translateY(-1px); }
        .act-btn.edit   { background: rgba(61,26,71,0.09);  color: ${S.plum}; }
        .act-btn.delete { background: rgba(220,38,38,0.09); color: #b91c1c; }

        input:focus, select:focus { border-color: ${S.plumLight} !important; }
        select option { background: ${S.white}; color: ${S.text}; }
      `}</style>

      <AdminNavbar />

      {/* ── Toast ── */}
      {toast.msg && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 300,
          background: S.white, border: `1px solid ${S.border}`,
          borderLeft: `4px solid ${toast.type === "err" ? "#b91c1c" : S.plum}`,
          borderRadius: 12, padding: "13px 20px",
          fontSize: 13.5, fontWeight: 500,
          boxShadow: "0 8px 28px rgba(61,26,71,0.13)",
          color: toast.type === "err" ? "#b91c1c" : S.plum,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>{toast.type === "err" ? "✕" : "✓"}</span>
          {toast.msg}
        </div>
      )}

      {/* ── Hero ── */}
      <div style={{ background: S.plum, color: S.cream, padding: "clamp(24px,4vw,40px) clamp(16px,4vw,40px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: S.creamDeep, marginBottom: 8 }}>
          Super Admin
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 400, letterSpacing: "-0.3px", lineHeight: 1.1, color: S.cream }}>
          Manage <em style={{ fontStyle: "italic", fontWeight: 300, color: S.creamDeep }}>Admins</em>
        </h1>
        <p style={{ marginTop: 10, fontSize: 13, color: "rgba(237,226,208,0.55)", letterSpacing: "0.3px" }}>
          {admins.length} admin{admins.length !== 1 ? "s" : ""} · full access control
        </p>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "clamp(24px,3vw,36px) clamp(16px,4vw,24px) 60px" }}>

        {/* Page header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: S.muted, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 20, height: "1.5px", background: S.plumLight, display: "inline-block" }} />
            Directory
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            style={{
              background: S.plum, color: S.cream, border: "none",
              padding: "10px 22px", borderRadius: 10, fontWeight: 600,
              fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: 8,
              transition: "opacity .2s",
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Admin
          </button>
        </div>

        {/* Admin list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {admins.length === 0 && (
            <div style={{ textAlign: "center", padding: "70px 0", color: S.muted, fontSize: 14 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: S.plumLight, marginBottom: 8 }}>No admins yet</div>
              <div style={{ fontSize: 13 }}>Create the first admin to get started.</div>
            </div>
          )}

          {admins.map(a => {
            const rs = roleStyle[a.role] || roleStyle.admin;
            return (
              <div key={a._id} className="admin-card">
                {/* Avatar */}
                <div style={{
                  width: 48, height: 48, borderRadius: 13,
                  background: "rgba(61,26,71,0.09)", border: `1.5px solid rgba(61,26,71,0.15)`,
                  color: S.plum, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 22, flexShrink: 0,
                }}>
                  {initials(a.email)}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 14.5, color: S.text, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {a.email}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.8px", textTransform: "uppercase", background: rs.bg, color: rs.color }}>
                      {a.role === "super_admin" ? "Super Admin" : "Admin"}
                    </span>
                    {a.isTempPassword && (
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.8px", textTransform: "uppercase", background: "rgba(212,196,176,0.4)", color: "#8B5E3C" }}>
                        Temp Password
                      </span>
                    )}
                    <span style={{ fontSize: 11.5, color: S.muted, fontVariantNumeric: "tabular-nums" }}>
                      ···{a._id?.slice(-6)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button className="act-btn edit"   onClick={() => setEditAdmin({ ...a })}>Edit</button>
                  <button className="act-btn delete" onClick={() => setConfirm(a._id)}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Delete confirm modal ── */}
      {confirm && (
        <Modal title="Remove Admin?" onClose={() => setConfirm(null)}>
          <p style={{ fontSize: 13.5, color: S.muted, marginBottom: 28, lineHeight: 1.8 }}>
            This action cannot be undone. The admin will lose all access immediately.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn onClick={() => setConfirm(null)} variant="ghost">Cancel</Btn>
            <Btn onClick={doDelete} variant="danger">Yes, Remove</Btn>
          </div>
        </Modal>
      )}

      {/* ── Edit modal ── */}
      {editAdmin && (
        <Modal title="Edit Admin" onClose={() => setEditAdmin(null)}>
          <div style={{ marginBottom: 18 }}>
            <FieldLabel>Email Address</FieldLabel>
            <input style={inp} value={editAdmin.email} onChange={e => setEditAdmin(a => ({ ...a, email: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 28 }}>
            <FieldLabel>Role</FieldLabel>
            <select style={{ ...inp, appearance: "none", cursor: "pointer" }} value={editAdmin.role} onChange={e => setEditAdmin(a => ({ ...a, role: e.target.value }))}>
              {ROLES.map(r => <option key={r} value={r}>{r === "super_admin" ? "Super Admin" : "Admin"}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn onClick={() => setEditAdmin(null)} variant="ghost">Cancel</Btn>
            <Btn onClick={doEdit} variant="primary">Save Changes</Btn>
          </div>
        </Modal>
      )}

      {/* ── Create modal ── */}
      {createOpen && (
        <Modal title="New Admin" onClose={() => setCreateOpen(false)}>
          <div style={{ marginBottom: 18 }}>
            <FieldLabel>Email Address</FieldLabel>
            <input style={inp} type="email" placeholder="admin@company.com" value={form.email} onChange={set("email")} />
          </div>
          <div style={{ marginBottom: 28 }}>
            <FieldLabel>Role</FieldLabel>
            <select style={{ ...inp, appearance: "none", cursor: "pointer" }} value={form.role} onChange={set("role")}>
              {ROLES.map(r => <option key={r} value={r}>{r === "super_admin" ? "Super Admin" : "Admin"}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn onClick={() => setCreateOpen(false)} variant="ghost">Cancel</Btn>
            <Btn onClick={doCreate} disabled={!form.email.trim()} variant="primary">Create Admin</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}