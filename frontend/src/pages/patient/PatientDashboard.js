import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { patientAPI } from "../../services/api";

function PatientDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const name = localStorage.getItem("name");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await patientAPI.getDashboard();
        setData(response.data);
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [navigate]);

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
          <Link to="/patient/appointments">My Appointments</Link>
          <Link to="/patient/book-appointment">Book Appointment</Link>
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
        <h2 style={{ marginBottom: "20px" }}>Welcome, {name}! 👋</h2>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{data?.appointments?.length || 0}</h3>
            <p>Total Appointments</p>
          </div>
          <div className="stat-card">
            <h3>
              {data?.appointments?.filter((a) => a.status === "PENDING")
                .length || 0}
            </h3>
            <p>Pending</p>
          </div>
          <div className="stat-card">
            <h3>
              {data?.appointments?.filter((a) => a.status === "CONFIRMED")
                .length || 0}
            </h3>
            <p>Confirmed</p>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="card">
          <h3 style={{ marginBottom: "15px" }}>Recent Appointments</h3>
          {data?.appointments?.length === 0 ? (
            <p>
              No appointments yet.{" "}
              <Link to="/patient/book-appointment" className="link">
                Book one now!
              </Link>
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.appointments?.slice(0, 5).map((apt) => (
                  <tr key={apt.id}>
                    <td>{apt.doctor?.user?.name}</td>
                    <td>{apt.doctor?.specialization}</td>
                    <td>{apt.appointmentDate}</td>
                    <td>{apt.appointmentTime}</td>
                    <td>
                      <span
                        className={`badge badge-${apt.status.toLowerCase()}`}
                      >
                        {apt.status}
                      </span>
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

export default PatientDashboard;
