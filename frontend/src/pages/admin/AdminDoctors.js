import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";

function AdminDoctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    experience: "",
    fees: "",
    availableDays: "",
    availableTime: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Update modal state
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateData, setUpdateData] = useState({
    id: "",
    specialization: "",
    experience: "",
    fees: "",
    availableDays: "",
    availableTime: "",
  });
  const [updateError, setUpdateError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await adminAPI.getAllDoctors();
      setDoctors(response.data);
    } catch (err) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: digitsOnly });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      await adminAPI.addDoctor(formData);
      setMessage("Doctor added successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        specialization: "",
        experience: "",
        fees: "",
        availableDays: "",
        availableTime: "",
        phone: "",
      });
      setShowForm(false);
      fetchDoctors();
    } catch (err) {
      setFormError("Failed to add doctor!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await adminAPI.deleteDoctor(id);
        setMessage("Doctor deleted successfully!");
        fetchDoctors();
      } catch (err) {
        setMessage("Failed to delete doctor!");
      }
    }
  };

  // Open update form with doctor's existing data
  const handleEditClick = (doc) => {
    setUpdateData({
      id: doc.id,
      specialization: doc.specialization || "",
      experience: doc.experience || "",
      fees: doc.fees || "",
      availableDays: doc.availableDays || "",
      availableTime: doc.availableTime || "",
    });
    setUpdateError("");
    setShowUpdateForm(true);
  };

  const handleUpdateChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError("");
    try {
      await adminAPI.updateDoctor(updateData.id, {
        specialization: updateData.specialization,
        experience: updateData.experience,
        fees: updateData.fees,
        availableDays: updateData.availableDays,
        availableTime: updateData.availableTime,
      });
      setMessage("Doctor updated successfully!");
      setShowUpdateForm(false);
      fetchDoctors();
    } catch (err) {
      setUpdateError("Failed to update doctor!");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    );

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <h2>🏥 Hospital Management System</h2>
        <div>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/patients">Patients</Link>
          <Link to="/admin/appointments">Appointments</Link>
          <button
            onClick={handleLogout}
            className="btn btn-danger"
            style={{ marginLeft: "20px" }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Manage Doctors</h2>
          <button
            className="btn btn-primary"
            style={{ width: "auto" }}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "+ Add Doctor"}
          </button>
        </div>

        {message && <div className="alert alert-success">{message}</div>}

        {/* Add Doctor Form */}
        {showForm && (
          <div className="card">
            <h3 style={{ marginBottom: "15px" }}>Add New Doctor</h3>
            {formError && <div className="alert alert-error">{formError}</div>}
            <form onSubmit={handleAddDoctor}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter 10-digit phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  maxLength="10"
                  title="Phone number must be exactly 10 digits"
                />
              </div>
              <div className="form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Experience (years)</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Consultation Fees (₹)</label>
                <input
                  type="number"
                  name="fees"
                  value={formData.fees}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Available Days</label>
                <input
                  type="text"
                  name="availableDays"
                  placeholder="e.g. Mon, Wed, Fri"
                  value={formData.availableDays}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Available Time</label>
                <input
                  type="text"
                  name="availableTime"
                  placeholder="e.g. 10:00 AM - 4:00 PM"
                  value={formData.availableTime}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Adding..." : "Add Doctor"}
              </button>
            </form>
          </div>
        )}

        {/* Update Doctor Modal */}
        {showUpdateForm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "10px",
                padding: "30px",
                width: "500px",
                maxWidth: "90%",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h3>✏️ Update Doctor</h3>
                <button
                  onClick={() => setShowUpdateForm(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              {updateError && (
                <div className="alert alert-error">{updateError}</div>
              )}

              <form onSubmit={handleUpdateSubmit}>
                <div className="form-group">
                  <label>Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={updateData.specialization}
                    onChange={handleUpdateChange}
                  />
                </div>
                <div className="form-group">
                  <label>Experience (years)</label>
                  <input
                    type="text"
                    name="experience"
                    value={updateData.experience}
                    onChange={handleUpdateChange}
                  />
                </div>
                <div className="form-group">
                  <label>Consultation Fees (₹)</label>
                  <input
                    type="number"
                    name="fees"
                    value={updateData.fees}
                    onChange={handleUpdateChange}
                  />
                </div>
                <div className="form-group">
                  <label>Available Days</label>
                  <input
                    type="text"
                    name="availableDays"
                    placeholder="e.g. Mon, Wed, Fri"
                    value={updateData.availableDays}
                    onChange={handleUpdateChange}
                  />
                </div>
                <div className="form-group">
                  <label>Available Time</label>
                  <input
                    type="text"
                    name="availableTime"
                    placeholder="e.g. 10:00 AM - 4:00 PM"
                    value={updateData.availableTime}
                    onChange={handleUpdateChange}
                  />
                </div>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  <button
                    type="submit"
                    className="btn btn-success"
                    style={{ width: "auto", flex: 1 }}
                    disabled={updating}
                  >
                    {updating ? "Updating..." : "✅ Update Doctor"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{ width: "auto", flex: 1 }}
                    onClick={() => setShowUpdateForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Doctors Table */}
        {doctors.length === 0 ? (
          <div className="card">
            <p>No doctors found.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Fees</th>
                <th>Available Days</th>
                <th>Available Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc, index) => (
                <tr key={doc.id}>
                  <td>{index + 1}</td>
                  <td>{doc.user?.name}</td>
                  <td>{doc.user?.email}</td>
                  <td>{doc.specialization}</td>
                  <td>{doc.experience ? `${doc.experience} yrs` : "-"}</td>
                  <td>₹{doc.fees}</td>
                  <td>{doc.availableDays || "-"}</td>
                  <td>{doc.availableTime || "-"}</td>
                  <td style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEditClick(doc)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(doc.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDoctors;
