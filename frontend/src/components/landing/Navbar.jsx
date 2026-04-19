import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      className="landing-navbar"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="logo">SmartCampus</div>

      <ul className="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#workflow">Workflow</a></li>
        <li><a href="#preview">Preview</a></li>
      </ul>

      <div className="nav-buttons">
        <button className="btn btn-outline">Login</button>
        <button className="btn btn-primary">Get Started</button>
      </div>
    </motion.nav>
  );
}