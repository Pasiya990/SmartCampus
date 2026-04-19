import { motion } from "framer-motion";
import heroImage from "../../assets/landing/hero-campus.jpg";
import dashboardImage from "../../assets/landing/dashboard-preview.png";

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>

      <img src={heroImage} alt="Campus" className="hero-bg" />

      <div className="hero-content">
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="hero-badge">Modern Campus Resource Management</p>
          <h1>
            Smart Campus
            <span> Operations Hub</span>
          </h1>
          <p className="hero-text">
            Manage resource bookings, facility assets, maintenance incidents,
            and notifications through one clean and powerful web platform.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-primary">Explore System</button>
            <button className="btn btn-outline">Login</button>
          </div>
        </motion.div>

        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9 }}
        >
          <div className="hero-image-card">
            <img src={dashboardImage} alt="Dashboard Preview" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}