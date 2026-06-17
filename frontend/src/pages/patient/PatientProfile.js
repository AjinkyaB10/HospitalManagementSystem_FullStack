import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { patientAPI } from "../../services/api";

function PatientProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: "",
    age: "",
    bloodGroup: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await patientAPI.getProfile();
        const p = response.data;
        setFormData({
          phone: p.phone || "",
          age: p.age || "",
          bloodGroup: p.bloodGroup || "",
          address: p.address || "",
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
      await patientAPI.updateProfile(formData);
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
          <Link to="/patient/dashboard">Dashboard</Link>
          <Link to="/patient/appointments">My Appointments</Link>
          <Link to="/patient/book-appointment">Book Appointment</Link>
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
          <h2>👤 My Profile</h2>

          {/* User Info */}
          <div className="card" style={{ marginBottom: "20px" }}>
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                placeholder="Enter age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
              >
                <option value="">-- Select Blood Group --</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter address"
                value={formData.address}
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

export default PatientProfile;
