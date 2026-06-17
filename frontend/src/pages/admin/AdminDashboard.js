import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const name = localStorage.getItem("name");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, appointmentsRes] = await Promise.all([
          adminAPI.getDashboard(),
          adminAPI.getAllAppointments(),
        ]);
        setData(dashboardRes.data);

        const pending = (appointmentsRes.data || []).filter(
          (apt) => apt.status === "PENDING",
        );
        setPendingAppointments(pending);
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
          <Link to="/admin/doctors">Doctors</Link>
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
        <h2 style={{ marginBottom: "20px" }}>Welcome, {name}! 👋</h2>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{data?.totalDoctors ?? 0}</h3>
            <p>Total Doctors</p>
            <Link to="/admin/doctors">
              <button
                className="btn btn-primary"
                style={{
                  marginTop: "12px",
                  width: "auto",
                  padding: "8px 18px",
                }}
              >
                Manage Doctors
              </button>
            </Link>
          </div>

          <div className="stat-card">
            <h3>{data?.totalPatients ?? 0}</h3>
            <p>Total Patients</p>
            <Link to="/admin/patients">
              <button
                className="btn btn-primary"
                style={{
                  marginTop: "12px",
                  width: "auto",
                  padding: "8px 18px",
                }}
              >
                View Patients
              </button>
            </Link>
          </div>

          <div className="stat-card">
            <h3>{data?.totalAppointments ?? 0}</h3>
            <p>Total Appointments</p>
            <Link to="/admin/appointments">
              <button
                className="btn btn-primary"
                style={{
                  marginTop: "12px",
                  width: "auto",
                  padding: "8px 18px",
                }}
              >
                View Appointments
              </button>
            </Link>
          </div>
        </div>

        {/* Pending Appointments */}
        <div className="card">
          <h3 style={{ marginBottom: "15px" }}>
            Pending Appointments ({pendingAppointments.length})
          </h3>
          {pendingAppointments.length === 0 ? (
            <p>No pending appointments.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingAppointments.slice(0, 5).map((apt) => (
                  <tr key={apt.id}>
                    <td>{apt.patient?.user?.name}</td>
                    <td>{apt.doctor?.user?.name}</td>
                    <td>{apt.doctor?.specialization}</td>
                    <td>{apt.appointmentDate}</td>
                    <td>{apt.appointmentTime}</td>
                    <td>
                      <span className="badge badge-pending">{apt.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {pendingAppointments.length > 5 && (
            <p style={{ marginTop: "12px" }}>
              <Link to="/admin/appointments" className="link">
                View all {pendingAppointments.length} pending appointments →
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
