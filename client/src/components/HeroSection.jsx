import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const handleGetStarted = () => {
    if (user) {
      navigate(`/dashboard`);
    } else {
      navigate("/login");
    }
  };
  return (
    <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI-Powered Fitness Revolution
          </h1>
          <p className="text-xl md:text-2xl text-light/80 mb-8">
            Your personalized journey to optimal health powered by OptiLife AI
          </p>

          <button
            onClick={handleGetStarted}
            className="bg-primary hover:bg-secondary text-light font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </button>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <img
            src="/images/hero-image.png"
            alt="Fitness app interface"
            className="rounded-2xl shadow-2xl border-2 border-primary/20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/60 to-dark/20 rounded-2xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
