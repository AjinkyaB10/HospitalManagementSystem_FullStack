import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { patientAPI } from "../../services/api";

function BookAppointment() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    symptoms: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await patientAPI.getDoctors();
        setDoctors(response.data);
      } catch (err) {
        navigate("/login");
      }
    };
    fetchDoctors();
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
      await patientAPI.bookAppointment(formData);
      setSuccess("Appointment booked successfully!");
      setTimeout(() => navigate("/patient/appointments"), 2000);
    } catch (err) {
      setError("Failed to book appointment!");
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
          <Link to="/patient/profile">Profile</Link>
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
          <h2>📅 Book Appointment</h2>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Doctor</label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Doctor --</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.user?.name} - {doc.specialization} (₹{doc.fees})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Appointment Date</label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>Appointment Time</label>
              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Symptoms</label>
              <input
                type="text"
                name="symptoms"
                placeholder="Describe your symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
