import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";

function AdminAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await adminAPI.getAllAppointments();
        setAppointments(response.data);
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
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
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/doctors">Doctors</Link>
          <Link to="/admin/patients">Patients</Link>
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
        <h2 style={{ marginBottom: "20px" }}>All Appointments</h2>

        {appointments.length === 0 ? (
          <div className="card">
            <p>No appointments found.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt, index) => (
                <tr key={apt.id}>
                  <td>{index + 1}</td>
                  <td>{apt.patient?.user?.name}</td>
                  <td>{apt.doctor?.user?.name}</td>
                  <td>{apt.doctor?.specialization}</td>
                  <td>{apt.appointmentDate}</td>
                  <td>{apt.appointmentTime}</td>
                  <td>
                    <span className={`badge badge-${apt.status.toLowerCase()}`}>
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
  );
}

export default AdminAppointments;
