import { motion } from 'framer-motion';
import { ArrowPathIcon, ChartBarIcon, UserIcon } from '@heroicons/react/24/outline';

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserIcon className="h-12 w-12" />,
      title: "Profile Setup",
      text: "Tell us about your goals, preferences, and lifestyle"
    },
    {
      icon: <ArrowPathIcon className="h-12 w-12" />,
      title: "AI Analysis",
      text: "Our Gemini AI processes 50+ health parameters"
    },
    {
      icon: <ChartBarIcon className="h-12 w-12" />,
      title: "Get Your Plan",
      text: "Receive personalized diet & workout recommendations"
    }
  ];

  return (
    <section id="how-it-works" className="px-6 bg-dark/80">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-light mb-16">
          WorkFlow
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-dark/60 p-8 rounded-xl border border-primary/20 hover:border-secondary/40 transition-colors"
            >
              <div className="text-primary mb-6">{step.icon}</div>
              <h3 className="text-2xl font-bold text-light mb-4">{step.title}</h3>
              <p className="text-light/80">{step.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Process Image */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 relative"
        >
          <img
            src="/images/Hero2.png"
            alt="AI process flow"
            className="w-full h-180 rounded-2xl border border-primary/20"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;