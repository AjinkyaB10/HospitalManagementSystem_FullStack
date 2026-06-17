import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";

function AdminPatients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Update modal state
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateData, setUpdateData] = useState({
    id: "",
    phone: "",
    age: "",
    bloodGroup: "",
    address: "",
  });
  const [updateError, setUpdateError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await adminAPI.getAllPatients();
      setPatients(response.data);
    } catch (err) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (p) => {
    setUpdateData({
      id: p.id,
      phone: p.phone || "",
      age: p.age || "",
      bloodGroup: p.bloodGroup || "",
      address: p.address || "",
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
      await adminAPI.updatePatient(updateData.id, {
        phone: updateData.phone,
        age: updateData.age,
        bloodGroup: updateData.bloodGroup,
        address: updateData.address,
      });
      setMessage("Patient updated successfully!");
      setShowUpdateForm(false);
      fetchPatients();
    } catch (err) {
      setUpdateError("Failed to update patient!");
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
          <Link to="/admin/doctors">Doctors</Link>
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
        <h2 style={{ marginBottom: "20px" }}>Manage Patients</h2>

        {message && <div className="alert alert-success">{message}</div>}

        {/* Update Patient Modal */}
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
                <h3>✏️ Update Patient</h3>
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
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={updateData.phone}
                    onChange={handleUpdateChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={updateData.age}
                    onChange={handleUpdateChange}
                    placeholder="Enter age"
                  />
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={updateData.bloodGroup}
                    onChange={handleUpdateChange}
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
                    value={updateData.address}
                    onChange={handleUpdateChange}
                    placeholder="Enter address"
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
                    {updating ? "Updating..." : "✅ Update Patient"}
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

        {patients.length === 0 ? (
          <div className="card">
            <p>No patients found.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Blood Group</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, index) => (
                <tr key={p.id}>
                  <td>{index + 1}</td>
                  <td>{p.user?.name}</td>
                  <td>{p.user?.email}</td>
                  <td>{p.phone || "-"}</td>
                  <td>{p.age || "-"}</td>
                  <td>{p.bloodGroup || "-"}</td>
                  <td>{p.address || "-"}</td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEditClick(p)}
                    >
                      Update
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

export default AdminPatients;
