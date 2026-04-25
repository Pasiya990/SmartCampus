import { useState } from "react";
import API from "../services/api";
import "./Login.css";

export default function Login() {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const token = res.data;
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;
      const userEmail = payload.email;

      if (role) localStorage.setItem("role", role);
      if (userEmail) localStorage.setItem("email", userEmail);
      localStorage.setItem("user", JSON.stringify({ email: userEmail, role }));

      if (role === "ADMIN") window.location.href = "/admin";
      else if (role === "TECHNICIAN") window.location.href = "/technician";
      else window.location.href = "/user";

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div
      className="login-bg"
      style={{ backgroundImage: `url("/login-bg1.jpg")` }}
    >
      <div className="login-card">

        {/* LOGO MARK */}
        <div className="login-logo">R</div>

        <h1>Resora</h1>
        <p className="subtitle">Sign in to continue to your workspace</p>

        {/* PRIMARY — Google */}
        <button
          className="google-btn"
          onClick={() =>
            (window.location.href =
              "http://localhost:8080/oauth2/authorization/google")
          }
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="divider">or</div>

        {/* TOGGLE — Admin form */}
        <button
          className="toggle-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Hide Admin Login" : "Admin Login"}
        </button>

        {showForm && (
          <>
            <div className="input-group">
              <input
                type="text"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="login-btn" onClick={handleLogin}>
              Sign in
            </button>
          </>
        )}

        <p className="login-footer">
          By signing in, you agree to the CampusCore terms of use.
        </p>

      </div>
    </div>
  );
}