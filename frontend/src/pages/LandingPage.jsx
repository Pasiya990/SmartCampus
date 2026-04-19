import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import WorkflowSection from "../components/landing/WorkflowSection";
import PreviewSection from "../components/landing/PreviewSection";
import Footer from "../components/landing/Footer";
import "./Landing.css";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <PreviewSection />
      <Footer />
    </div>
  );
}