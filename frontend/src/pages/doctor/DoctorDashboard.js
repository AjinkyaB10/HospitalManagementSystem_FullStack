import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doctorAPI } from "../../services/api";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const name = localStorage.getItem("name");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, profileRes] = await Promise.all([
          doctorAPI.getDashboard(),
          doctorAPI.getProfile(),
        ]);
        setData(dashboardRes.data);
        setProfile(profileRes.data);
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
          <Link to="/doctor/appointments">My Appointments</Link>
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
        <h2 style={{ marginBottom: "20px" }}>Welcome, Dr. {name}! 👋</h2>

        {/* Doctor Info */}
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h3>Profile Summary</h3>
            <Link to="/doctor/profile">
              <button
                className="btn btn-primary"
                style={{ width: "auto", padding: "8px 18px", fontSize: "14px" }}
              >
                ✏️ Edit Profile
              </button>
            </Link>
          </div>
          <table>
            <tbody>
              <tr>
                <td>
                  <strong>Specialization</strong>
                </td>
                <td>{profile?.specialization || "-"}</td>
              </tr>
              <tr>
                <td>
                  <strong>Experience</strong>
                </td>
                <td>
                  {profile?.experience ? `${profile.experience} yrs` : "-"}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Consultation Fees</strong>
                </td>
                <td>{profile?.fees ? `₹${profile.fees}` : "-"}</td>
              </tr>
              <tr>
                <td>
                  <strong>Available Days</strong>
                </td>
                <td>{profile?.availableDays || "-"}</td>
              </tr>
              <tr>
                <td>
                  <strong>Available Time</strong>
                </td>
                <td>{profile?.availableTime || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

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
            <p>No appointments yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Symptoms</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.appointments?.slice(0, 5).map((apt) => (
                  <tr key={apt.id}>
                    <td>{apt.patient?.user?.name}</td>
                    <td>{apt.appointmentDate}</td>
                    <td>{apt.appointmentTime}</td>
                    <td>{apt.symptoms}</td>
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

export default DoctorDashboard;
