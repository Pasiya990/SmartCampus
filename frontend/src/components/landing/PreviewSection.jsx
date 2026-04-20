import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import catalogueImage from "../../assets/landing/catalogue-preview.jpg";
import bookingImage from "../../assets/landing/booking-preview.jpg";
import notificationImage from "../../assets/landing/notification-preview.jpg";
import dashboardImage from "../../assets/landing/dashboard-preview.jpg";

const slides = [
  {
    image: dashboardImage,
    title: "Powerful Admin Dashboard",
    desc: "Monitor bookings, resources, ticket activity, and system performance from one central place.",
  },
  {
    image: catalogueImage,
    title: "Smart Resource Catalogue",
    desc: "View all campus facilities and equipment with search, filters, capacity, and location details.",
  },
  {
    image: bookingImage,
    title: "Simple Booking Experience",
    desc: "Users can request resources quickly with date, purpose, attendees, and conflict-aware scheduling.",
  },
  {
    image: notificationImage,
    title: "Real-Time Notifications",
    desc: "Stay informed about approval decisions, status changes, and important updates instantly.",
  },
];

export default function PreviewSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="preview-section" id="preview">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-tag">System Preview</p>
        <h2>See the platform in action</h2>
      </motion.div>

      <div className="preview-wrapper">
        <div className="preview-text">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.6 }}
            >
              <h3>{slides[current].title}</h3>
              <p>{slides[current].desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="preview-image-box">
          <AnimatePresence mode="wait">
            <motion.img
              key={slides[current].image}
              src={slides[current].image}
              alt={slides[current].title}
              className="preview-image"
              initial={{ opacity: 0, x: 100, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.92 }}
              transition={{ duration: 0.7 }}
            />
          </AnimatePresence>
        </div>
      </div>

      <div className="preview-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${current === index ? "active-dot" : ""}`}
            onClick={() => setCurrent(index)}
          ></button>
        ))}
      </div>
    </section>
  );
}