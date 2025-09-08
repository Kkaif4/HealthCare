import React from 'react';
import { motion } from 'framer-motion';
import { FiDroplet, FiActivity, FiPlus } from 'react-icons/fi';

const PlanCard = ({ icon, title, description, onClick }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-dark/60 hover:bg-dark/80 border border-primary/20 rounded-xl p-4 transition-all cursor-pointer"
    onClick={onClick}>
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-light/80">{description}</p>
    <button className="mt-4 text-primary flex items-center">
      <FiPlus className="mr-2" /> Generate Plan
    </button>
  </motion.div>
);

const GeneratePlans = ({ onDietClick, onWorkoutClick }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-2xl font-bold mb-4">Generate New Plans</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PlanCard
          icon={<FiDroplet className="h-8 w-8" />}
          title="Diet Plan"
          description="Create personalized nutrition plan based on your goals"
          onClick={onDietClick}
        />
        <PlanCard
          icon={<FiActivity className="h-8 w-8" />}
          title="Workout Plan"
          description="Get custom exercise routine tailored for you"
          onClick={onWorkoutClick}
        />
      </div>
    </motion.div>
  );
};

export default GeneratePlans;
