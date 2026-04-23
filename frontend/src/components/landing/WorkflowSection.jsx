import { motion } from "framer-motion";
import { Search, FilePenLine, ClipboardCheck, Bell } from "lucide-react";

const steps = [
  {
    icon: <Search size={34} />,
    title: "Browse Resources",
    desc: "Explore available lecture halls, labs, meeting rooms, and equipment with their details.",
  },
  {
    icon: <FilePenLine size={34} />,
    title: "Submit a Request",
    desc: "Create a booking request or report an issue by entering the required details in a few simple steps.",
  },
  {
    icon: <ClipboardCheck size={34} />,
    title: "Staff Reviews It",
    desc: "Your request is reviewed by the relevant staff member to ensure availability and proper handling.",
  },
  {
    icon: <Bell size={34} />,
    title: "Get Notified",
    desc: "Receive status updates and track your bookings and tickets anytime through the platform.",
  },
];

export default function WorkflowSection() {
  return (
    <section className="workflow-section" id="workflow">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-tag">How It Works</p>
        <h2>A smooth step-by-step experience for users</h2>
      </motion.div>

      <div className="workflow-line"></div>

      <div className="workflow-grid">
        {steps.map((step, index) => (
          <motion.div
            className="workflow-card"
            key={index}
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: index * 0.2,
              type: "spring",
            }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="step-number">{index + 1}</div>
            <div className="workflow-icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}