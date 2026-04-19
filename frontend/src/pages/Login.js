import { useState } from "react";
import API from "../services/api";
import "./Login.css";

export default function Login() {
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

      if (role) {
        localStorage.setItem("role", role);
      }

      if (userEmail) {
        localStorage.setItem("email", userEmail);
      }

      localStorage.setItem("user", JSON.stringify({ email: userEmail, role }));

      alert("Login success");

      if (role === "ADMIN") {
        window.location.href = "/admin";
      } else if (role === "TECHNICIAN") {
        window.location.href = "/technician";
      } else if (role === "USER") {
        window.location.href = "/user";
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="bg-shape shape1"></div>
      <div className="bg-shape shape2"></div>
      <div className="bg-shape shape3"></div>

      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to your account</p>
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Email Address"
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
          Login
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <button
          className="google-btn"
          onClick={() => {
            window.location.href =
              "http://localhost:8080/oauth2/authorization/google";
          }}
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}