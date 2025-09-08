import { motion } from 'framer-motion';
import { BoltIcon, CalendarIcon, ChartPieIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

const FeaturesSection = () => {
  const features = [
    {
      icon: <BoltIcon className="h-12 w-12" />,
      title: "Instant Adaptations",
      description: "AI adjusts your plan in real-time based on daily progress"
    },
    {
      icon: <ChartPieIcon className="h-12 w-12" />,
      title: "Nutrition Analysis",
      description: "Smart meal tracking with macro optimization"
    },
    {
      icon: <DevicePhoneMobileIcon className="h-12 w-12" />,
      title: "Mobile First",
      description: "Seamless experience across all devices"
    },
    {
      icon: <CalendarIcon className="h-12 w-12" />,
      title: "Progress Tracking",
      description: "Visual timeline of your fitness journey"
    }
  ];

  return (
    <section id="features" className="py-20 px-6 bg-dark/90">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-light mb-4">
            Powerful Features
          </h2>
          <p className="text-light/80 text-xl">
            Everything you need for sustainable fitness success
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-dark/60 p-8 rounded-xl border border-primary/20 hover:border-secondary/40 transition-colors group"
            >
              <div className="text-primary mb-6 transition-colors group-hover:text-secondary">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-light mb-4">{feature.title}</h3>
              <p className="text-light/80">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Feature Showcase Image */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="w-full h-150 mt-10 mb-0 rounded-2xl overflow-hidden flex justify-center items-center"
        >
          <img
            src="/images/logo.png"
            alt="App dashboard preview"
            className="w-200 h-200 drop-shadow-[0_0_60px_rgba(0,255,255,0.4)]"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;