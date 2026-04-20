import { motion } from "framer-motion";
import { Search, FilePenLine, ShieldCheck, Bell } from "lucide-react";

const steps = [
  {
    icon: <Search size={34} />,
    title: "Browse Resources",
    desc: "Users search for available halls, labs, meeting rooms, and equipment.",
  },
  {
    icon: <FilePenLine size={34} />,
    title: "Submit Request",
    desc: "Users enter booking details such as date, time, purpose, and attendee count.",
  },
  {
    icon: <ShieldCheck size={34} />,
    title: "Admin Reviews",
    desc: "Admins review the request, check availability, and approve or reject it.",
  },
  {
    icon: <Bell size={34} />,
    title: "Get Updates",
    desc: "Users receive notifications and track the final booking outcome.",
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
        <p className="section-tag">System Workflow</p>
        <h2>How the platform works</h2>
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