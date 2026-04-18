import { useState } from "react";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
  
      const token = res.data;
      localStorage.setItem("token", token);


  
      // 🔥 Decode token
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;
  

      alert("Login success");
  
      // 🔥 Redirect based on role
      if (role === "ADMIN") {
        window.location.href = "/admin";
      } else if (role === "TECHNICIAN") {
        window.location.href = "/technician";
      } else if (role === "USER") {
        window.location.href = "/user";
      }
  
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password"
             onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleLogin}>Login</button>

      <br /><br />

      <button onClick={() => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
      }}>
        Login with Google
      </button>
    </div>
  );
}