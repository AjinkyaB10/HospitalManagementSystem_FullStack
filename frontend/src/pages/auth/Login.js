import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../../services/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(formData);
      const { token, role, name, email } = response.data;

      // ✅ Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);

      // ✅ Redirect based on role
      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "DOCTOR") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/patient/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>🏥 Hospital Login</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <br />
      <p style={{ textAlign: "center" }}>
        Don't have an account?{" "}
        <Link to="/register" className="link">
          Register here
        </Link>
      </p>
    </div>
  );
}

export default Login;
