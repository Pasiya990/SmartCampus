import { motion } from "framer-motion";
import { Building2, CalendarCheck2, Wrench, BellRing } from "lucide-react";

const features = [
  {
    icon: <Building2 size={34} />,
    title: "Resource Catalogue",
    desc: "Browse lecture halls, labs, meeting rooms, and equipment with filters and availability details.",
  },
  {
    icon: <CalendarCheck2 size={34} />,
    title: "Booking Management",
    desc: "Submit and manage booking requests with clear workflows and conflict-free scheduling.",
  },
  {
    icon: <Wrench size={34} />,
    title: "Maintenance Tickets",
    desc: "Create incident reports, attach evidence, and track technician progress smoothly.",
  },
  {
    icon: <BellRing size={34} />,
    title: "Notifications",
    desc: "Receive instant updates for approvals, status changes, and important ticket comments.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="features-section" id="features">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-tag">Core Features</p>
        <h2>Everything needed to run campus operations smarter</h2>
      </motion.div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <motion.div
            className="feature-card"
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            whileHover={{ y: -8 }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}