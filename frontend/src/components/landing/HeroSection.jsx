import { motion } from "framer-motion";
import heroImage from "../../assets/landing/hero-campus.jpg";
import previewImage from "../../assets/landing/catalogue-preview.jpg";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

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
          <p className="hero-badge">Simple. Fast. User Friendly.</p>

          <h1>
            Smart Campus
            <span> Operations Hub</span>
          </h1>

          <p className="hero-text">
            Book campus resources, report maintenance issues, and stay updated
            through one simple and organized platform built for students and staff.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => navigate("/login")}>Get Started</button>
            <button className="btn btn-outline" onClick={() => navigate("/login")}>Login</button>
          </div>
        </motion.div>

        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9 }}
        >
          <div className="hero-image-card">
            <img src={previewImage} alt="Resource Catalogue Preview" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}