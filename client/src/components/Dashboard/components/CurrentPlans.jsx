import { motion } from 'framer-motion';
import { FiCalendar, FiEdit } from 'react-icons/fi';

const CurrentPlans = ({
  currentDietPlan,
  currentWorkoutPlan,
  onViewDietPlan,
  onViewWorkoutPlan,
}) => {
  const formatDate = (date) => {
    return date
      ? new Date(date).toLocaleString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : 'Date not available';
  };

  const hasNoPlans = !currentDietPlan && !currentWorkoutPlan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Current Plans</h2>
        {hasNoPlans && (
          <span className="text-light/60 text-sm">
            No active plans - Generate your first plan to get started!
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PlanCard
          title="Current Diet Plan"
          date={currentDietPlan?.createdAt}
          to="/diet-plan-details"
          onClick={onViewDietPlan}
          formatDate={formatDate}
        />
        <PlanCard
          title="Current Workout Plan"
          date={currentWorkoutPlan?.createdAt}
          to="/workout-plan-details"
          onClick={onViewWorkoutPlan}
          formatDate={formatDate}
        />
      </div>
    </motion.div>
  );
};

const PlanCard = ({ title, date, onClick, formatDate }) => {
  const hasNoPlan = !date;

  return (
    <motion.div
      whileHover={{ scale: hasNoPlan ? 1 : 1.02 }}
      className={`bg-dark/60 border border-primary/20 rounded-xl p-4 ${
        hasNoPlan ? 'opacity-75' : 'hover:shadow-lg hover:shadow-primary/5'
      } transition-all`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold">{title}</h3>
        {hasNoPlan ? (
          <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-sm">
            No Plan
          </span>
        ) : (
          <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-sm">
            Active
          </span>
        )}
      </div>
      <div className="space-y-2">
        {hasNoPlan ? (
          <p className="text-light/60">
            No plan has been generated yet. Generate a new plan to get started!
          </p>
        ) : (
          <>
            <div className="flex items-center text-light/80">
              <FiCalendar className="mr-2" /> Created: {formatDate(date)}
            </div>
            <button
              onClick={onClick}
              className="w-full mt-2 bg-primary/20 hover:bg-primary/30 text-primary py-2 rounded-lg transition-colors flex items-center justify-center">
              <FiEdit className="mr-2" /> View Details
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default CurrentPlans;
