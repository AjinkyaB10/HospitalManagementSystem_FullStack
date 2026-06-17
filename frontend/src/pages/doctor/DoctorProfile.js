import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doctorAPI } from "../../services/api";

function DoctorProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    fees: "",
    availableDays: "",
    availableTime: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await doctorAPI.getProfile();
        const p = response.data;
        setFormData({
          specialization: p.specialization || "",
          experience: p.experience || "",
          fees: p.fees || "",
          availableDays: p.availableDays || "",
          availableTime: p.availableTime || "",
        });
      } catch (err) {
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await doctorAPI.updateProfile(formData);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <h2>🏥 Hospital Management System</h2>
        <div>
          <Link to="/doctor/dashboard">Dashboard</Link>
          <Link to="/doctor/appointments">My Appointments</Link>
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
        <div className="form-container" style={{ maxWidth: "550px" }}>
          <h2>👨‍⚕️ My Profile</h2>

          {/* User Info */}
          <div className="card" style={{ marginBottom: "20px" }}>
            <p>
              <strong>Name:</strong> Dr. {name}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Specialization</label>
              <input
                type="text"
                name="specialization"
                placeholder="e.g. Cardiologist"
                value={formData.specialization}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Experience (years)</label>
              <input
                type="number"
                name="experience"
                placeholder="Enter years of experience"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Consultation Fees (₹)</label>
              <input
                type="number"
                name="fees"
                placeholder="Enter consultation fees"
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
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
