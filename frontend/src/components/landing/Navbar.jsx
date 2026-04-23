import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <motion.nav
      className="landing-navbar"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        Resora
      </div>

      <ul className="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#workflow">Workflow</a></li>
        <li><a href="#preview">Preview</a></li>
      </ul>

      <div className="nav-buttons">
        <button className="btn btn-outline" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          Get Started
        </button>
      </div>
    </motion.nav>
  );
}