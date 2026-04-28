import { useState, useEffect } from "react";
import AdminNavbar from "../components/adminnavbar";
import API_BASE_URL from "../../config/api";
import axios from "axios";

export default function ManageWalkIns() {
  const [walkIns, setWalkIns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "", jobTitle: "", location: "", salary: "",
    workMode: "On-site", experienceLevel: "", description: "",
    eligibility: "", batch: "", expiryDate: "",
    isVerified: false, isHot: false, status: "active", skills: "", applyLink: ""
  });
  const [editId, setEditId] = useState(null);

  const fetchWalkIns = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/walkin/admin/all`, { withCredentials: true });
      if (res.data.success) {
        setWalkIns(res.data.data);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to fetch walk-ins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalkIns();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (typeof payload.skills === 'string') {
        payload.skills = payload.skills.split(',').map(s => s.trim()).filter(Boolean);
      }
      
      if (editId) {
        await axios.put(`${API_BASE_URL}/api/walkin/${editId}`, payload, { withCredentials: true });
        alert("Walk-In Job updated!");
      } else {
        await axios.post(`${API_BASE_URL}/api/walkin`, payload, { withCredentials: true });
        alert("Walk-In Job created!");
      }
      
      setFormData({
        companyName: "", jobTitle: "", location: "", salary: "",
        workMode: "On-site", experienceLevel: "", description: "",
        eligibility: "", batch: "", expiryDate: "",
        isVerified: false, isHot: false, status: "active", skills: "", applyLink: ""
      });
      setShowForm(false);
      setEditId(null);
      fetchWalkIns();
    } catch (error) {
      console.error(error);
      alert("Error saving walk-in job");
    }
  };

  const handleEdit = (job) => {
    setFormData({
      ...job,
      skills: job.skills ? job.skills.join(", ") : "",
      expiryDate: job.expiryDate ? job.expiryDate.substring(0, 10) : ""
    });
    setEditId(job._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/walkin/${id}`, { withCredentials: true });
      fetchWalkIns();
    } catch (error) {
      console.error(error);
      alert("Failed to delete");
    }
  };

  const toggleStatus = async (job) => {
    try {
      const newStatus = job.status === "active" ? "closed" : "active";
      await axios.put(`${API_BASE_URL}/api/walkin/${job._id}`, { status: newStatus }, { withCredentials: true });
      fetchWalkIns();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ background: "#F4F7FB", minHeight: "100vh", paddingBottom: 50 }}>
      <AdminNavbar />
      <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", color: "#3D1A47" }}>Manage Walk-In Drives</h2>
          <button 
            onClick={() => { setShowForm(!showForm); setEditId(null); setFormData({ companyName: "", jobTitle: "", location: "", salary: "", workMode: "On-site", experienceLevel: "", description: "", eligibility: "", batch: "", expiryDate: "", isVerified: false, isHot: false, status: "active", skills: "", applyLink: "" }); }}
            style={{ padding: "10px 20px", background: "#3D1A47", color: "#fff", borderRadius: 5, border: "none", cursor: "pointer", fontWeight: "bold" }}
          >
            {showForm ? "Close Form" : "+ Create Walk-In"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 20, borderRadius: 8, marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" style={inputStyle} />
            <input required type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="Job Title" style={inputStyle} />
            <input required type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" style={inputStyle} />
            <input required type="url" name="applyLink" value={formData.applyLink} onChange={handleChange} placeholder="Apply Link (https://...)" style={inputStyle} />
            <input type="text" name="salary" value={formData.salary} onChange={handleChange} placeholder="Salary (e.g. ₹4.5 LPA)" style={inputStyle} />
            
            <select name="workMode" value={formData.workMode} onChange={handleChange} style={inputStyle}>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
            
            <input type="text" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} placeholder="Experience (e.g. 0-2 Years)" style={inputStyle} />
            <input type="text" name="batch" value={formData.batch} onChange={handleChange} placeholder="Batch (e.g. 2024 / 2025)" style={inputStyle} />
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills (comma separated)" style={inputStyle} />
            <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} style={inputStyle} />
            <input type="text" name="eligibility" value={formData.eligibility} onChange={handleChange} placeholder="Eligibility (e.g. B.Tech / MCA)" style={inputStyle} />
            
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows="3" style={{ ...inputStyle, gridColumn: "span 2" }} />
            
            <div style={{ gridColumn: "span 2", display: "flex", gap: 20 }}>
              <label><input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleChange} /> Verified</label>
              <label><input type="checkbox" name="isHot" checked={formData.isHot} onChange={handleChange} /> HOT</label>
            </div>

            <button type="submit" style={{ gridColumn: "span 2", padding: 12, background: "#7B4A8B", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontWeight: "bold", fontSize: 16 }}>
              {editId ? "Update Job" : "Publish Walk-In Job"}
            </button>
          </form>
        )}

        <div style={{ background: "#fff", borderRadius: 8, padding: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          {loading ? <p>Loading...</p> : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#EDE2D0", textAlign: "left", color: "#3D1A47" }}>
                  <th style={{ padding: 10 }}>Job</th>
                  <th style={{ padding: 10 }}>Company</th>
                  <th style={{ padding: 10 }}>Location</th>
                  <th style={{ padding: 10 }}>Status</th>
                  <th style={{ padding: 10 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {walkIns.length === 0 ? <tr><td colSpan="5" style={{ padding: 20, textAlign: "center" }}>No walk-in drives found.</td></tr> : walkIns.map(job => (
                  <tr key={job._id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: 10 }}>
                      <strong>{job.jobTitle}</strong><br/>
                      <span style={{ fontSize: 12, color: "#666" }}>{job.workMode}</span>
                    </td>
                    <td style={{ padding: 10 }}>{job.companyName}</td>
                    <td style={{ padding: 10 }}>{job.location}</td>
                    <td style={{ padding: 10 }}>
                      <button onClick={() => toggleStatus(job)} style={{ padding: "4px 8px", background: job.status === "active" ? "#dcfce7" : "#fee2e2", color: job.status === "active" ? "#166534" : "#b91c1c", border: "none", borderRadius: 4, cursor: "pointer" }}>
                        {job.status}
                      </button>
                    </td>
                    <td style={{ padding: 10 }}>
                      <button onClick={() => handleEdit(job)} style={{ marginRight: 10, padding: "5px 10px", cursor: "pointer", background: "#f0f0f0", border: "1px solid #ccc", borderRadius: 4 }}>Edit</button>
                      <button onClick={() => handleDelete(job._id)} style={{ padding: "5px 10px", background: "#ff4d4f", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "5px",
  width: "100%",
  boxSizing: "border-box"
};
