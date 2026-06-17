import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doctorAPI } from "../../services/api";

function DoctorAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await doctorAPI.getAppointments();
      setAppointments(response.data);
    } catch (err) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await doctorAPI.confirmAppointment(id);
      setMessage("Appointment confirmed successfully!");
      fetchAppointments();
    } catch (err) {
      setMessage("Failed to confirm appointment!");
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await doctorAPI.cancelAppointment(id);
        setMessage("Appointment cancelled successfully!");
        fetchAppointments();
      } catch (err) {
        setMessage("Failed to cancel appointment!");
      }
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
          <Link to="/doctor/dashboard">Dashboard</Link>
          <Link to="/doctor/profile">Profile</Link>
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
        <h2 style={{ marginBottom: "20px" }}>My Appointments</h2>

        {message && <div className="alert alert-success">{message}</div>}

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
                <th>Date</th>
                <th>Time</th>
                <th>Symptoms</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt, index) => (
                <tr key={apt.id}>
                  <td>{index + 1}</td>
                  <td>{apt.patient?.user?.name}</td>
                  <td>{apt.appointmentDate}</td>
                  <td>{apt.appointmentTime}</td>
                  <td>{apt.symptoms}</td>
                  <td>
                    <span className={`badge badge-${apt.status.toLowerCase()}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td>
                    {apt.status === "PENDING" && (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => handleConfirm(apt.id)}
                          style={{ marginRight: "8px" }}
                        >
                          Confirm
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleCancel(apt.id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
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

export default DoctorAppointments;
