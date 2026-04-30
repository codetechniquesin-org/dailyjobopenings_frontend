import { useState } from "react";

const JobExtractor = ({ API_BASE_URL, onExtract, S }) => {
  const [mode, setMode] = useState("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = JSON.parse(localStorage.getItem("adminInfo"))?.token;

  const handleExtract = async () => {
    // Validation
    if (mode === "url" && !url.trim()) {
      return setMessage("❌ Please enter a valid URL");
    }

    if (mode === "text" && !text.trim()) {
      return setMessage("❌ Please paste job description");
    }

    setLoading(true);
    setMessage("");

    try {
      const endpoint =
        mode === "url"
          ? "/api/admin/extract-job-using-link"
          : "/api/admin/extract-job-using-text";

      const body =
        mode === "url"
          ? { url }
          : { text };

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (data.success) {
        setMessage("✅ Extracted successfully");

        // 🔥 send extracted data to parent
        if (onExtract) {
          onExtract(data.data);
        }

      } else {
        setMessage("❌ " + data.message);
      }

    } catch (err) {
      console.error(err);
      setMessage("❌ Extraction failed");
    }

    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ color: S.primary }}>⚡ Extract Details Automatically</h3>

      {/* Mode Switch */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {["url", "text"].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "1px solid #ddd",
              background: mode === m ? "#3D1A47" : "#C6C3B5",
              color: mode === m ? "#fff" : "#fff",
              cursor: "pointer"
            }}
          >
            {m === "url" ? "From URL" : "From Text"}
          </button>
        ))}
      </div>

      {/* URL Mode */}
      {mode === "url" && (
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste job link..."
            style={inputStyle}
          />
          <button
            onClick={handleExtract}
            disabled={loading}
            style={buttonStyle(S.primary, loading)}
          >
            {loading ? "Extracting..." : "Extract"}
          </button>
        </div>
      )}

      {/* TEXT Mode */}
      {mode === "text" && (
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste job description..."
            rows={5}
            style={{ ...inputStyle, width: "100%", resize: "vertical" }}
          />
          <button
            onClick={handleExtract}
            disabled={loading}
            style={{ ...buttonStyle(S.primary, loading), marginTop: 10 }}
          >
            {loading ? "Extracting..." : "Extract"}
          </button>
        </div>
      )}

      {/* Message */}
      {message && (
        <p style={{
          marginTop: 8,
          fontSize: 12,
          color: message.includes("❌") ? "red" : "green"
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

const containerStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  padding: 16,
  background: "#fff",
  marginBottom: 20
};

const inputStyle = {
  flex: 1,
  padding: "10px",
  borderRadius: 6,
  border: "1px solid #ddd",
  fontSize: 13,
  background: "#f9fafb",
  color: "#333"
};

const buttonStyle = (color, loading) => ({
  padding: "10px 16px",
  borderRadius: 6,
  border: "none",
  background: loading ? "#9ca3af" : "#3D1A47",
  color: "#fff",
  cursor: "pointer"
});

export default JobExtractor;