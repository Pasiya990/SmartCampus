import { motion } from "framer-motion";
import { Search, CalendarCheck2, Wrench, BellRing } from "lucide-react";

const features = [
  {
    icon: <Search size={34} />,
    title: "Find Resources Easily",
    desc: "Search lecture halls, labs, meeting rooms, and equipment with clear details such as capacity, location, and availability.",
  },
  {
    icon: <CalendarCheck2 size={34} />,
    title: "Book in Minutes",
    desc: "Submit booking requests quickly by selecting the date, time, purpose, and expected attendees.",
  },
  {
    icon: <Wrench size={34} />,
    title: "Report Issues Fast",
    desc: "Create maintenance or incident tickets with descriptions, priorities, and image evidence when needed.",
  },
  {
    icon: <BellRing size={34} />,
    title: "Track Updates",
    desc: "Receive notifications for booking approvals, ticket progress, status changes, and important comments.",
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
        <p className="section-tag">User Features</p>
        <h2>Everything you need in one smart campus platform</h2>
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