import { motion } from 'framer-motion';
import {
  HeartIcon,
  ClockIcon,
  ChartBarIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Vision = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleGetStarted = () => {
    if (user) {
      navigate(`/dashboard`);
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="relative py-20 px-6 bg-dark">
      <div className="max-w-7xl mx-auto">
        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Why We Created AI Health Planner
          </h2>
          <p className="text-xl text-light/80">
            Bridging the gap between modern life and sustainable health through
            AI-powered personalization
          </p>
        </motion.div>

        {/* Why It Matters */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-dark/50 p-8 rounded-xl border border-primary/20 hover:border-primary/40 transition-all">
            <ClockIcon className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-semibold text-light mb-4">
              Modern Lifestyle Challenges
            </h3>
            <p className="text-light/80">
              Time scarcity, information overload, and mental health demands
              require smart solutions
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-dark/50 p-8 rounded-xl border border-secondary/20 hover:border-secondary/40 transition-all">
            <HeartIcon className="h-12 w-12 text-secondary mb-4" />
            <h3 className="text-2xl font-semibold text-light mb-4">
              Prevention Focus
            </h3>
            <p className="text-light/80">
              74% of global deaths stem from preventable chronic diseases (WHO)
            </p>
          </motion.div>
        </div>

        {/* Differentiators */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-dark/50 p-8 rounded-xl border border-primary/20">
            <ChartBarIcon className="h-12 w-12 text-primary mb-4" />
            <h4 className="text-xl font-semibold text-light mb-2">
              Adaptive AI
            </h4>
            <p className="text-light/80">
              Real-time adjustments based on your progress
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-dark/50 p-8 rounded-xl border border-secondary/20">
            <BeakerIcon className="h-12 w-12 text-secondary mb-4" />
            <h4 className="text-xl font-semibold text-light mb-2">
              Science-Backed
            </h4>
            <p className="text-light/80">
              Built with nutritionists and fitness experts
            </p>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center">
          <button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-primary to-secondary text-light font-semibold py-4 px-12 rounded-full hover:scale-105 transition-all">
            Start Your Journey Today
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Vision;
