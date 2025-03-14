import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiActivity } from "react-icons/fi";
import { saveWorkoutPreferences } from "../../services/planServices";

const WorkoutPlanForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [formData, setFormData] = useState({
    workoutGoal: "",
    workoutPreferences: "",
    targetWeight: "",
    timePeriod: "",
    workoutDuration: "",
    equipment: "",
    healthConditions: "",
    injuryHistory: "",
    activityLevel: "",
    workoutDaysPerWeek: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);
    try {
      await Promise.all([
        saveWorkoutPreferences(formData),
        new Promise((resolve) => setTimeout(resolve, 15000)),
      ]);
    } catch (error) {
      console.error("Error saving workout preferences:", error);
    } finally {
      setisLoading(false);
      navigate("/workout-plan-details");
    }
  };
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dark text-light backdrop-blur-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg font-semibold">Loading plan details...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-md overflow-y-auto p-4"
    >
      <div className="relative w-full max-w-3xl mx-auto my-4">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-dark border border-primary/20 rounded-xl shadow-lg p-4 md:p-6 max-h-[90vh] overflow-y-auto"
        >
          <div className=" bg-dark z-10 pb-4 mb-4 border-b border-primary/10 ">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold text-light flex items-center">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Generate Workout Plan
                </span>
              </h2>
              <button
                onClick={onClose}
                className="text-light/60 hover:text-primary transition-colors"
              >
                <FiArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Workout Goal Selection */}
            <div>
              <label className="block text-light/80 mb-2 font-medium">
                Workout Goal
              </label>
              <select
                name="workoutGoal"
                value={formData.workoutGoal}
                onChange={handleChange}
                className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select</option>
                <option value="weight-loss">Weight Loss</option>
                <option value="weight-gain">Weight Gain</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {/* Workout Preferences */}
            <div>
              <label className="block text-light/80 mb-2 font-medium">
                Workout Preferences
              </label>
              <select
                name="workoutPreferences"
                value={formData.workoutPreferences}
                onChange={handleChange}
                className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select</option>
                <option value="home">Home</option>
                <option value="gym">Gym</option>
                <option value="outdoor">Outdoor</option>
                <option value="yoga">Yoga</option>
              </select>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-light/80 mb-2 font-medium">
                Activity Level
              </label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
              </select>
            </div>

            {/* Two Column Layout for Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Target Weight */}
              <div>
                <label className="block text-light/80 mb-2 font-medium">
                  Target Weight (kg)
                </label>
                <input
                  type="number"
                  name="targetWeight"
                  value={formData.targetWeight}
                  onChange={handleChange}
                  placeholder="Enter target weight"
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              {/* Time Period */}
              <div>
                <label className="block text-light/80 mb-2 font-medium">
                  Time Period (months)
                </label>
                <input
                  type="number"
                  name="timePeriod"
                  value={formData.timePeriod}
                  onChange={handleChange}
                  min="1"
                  max="24"
                  placeholder="Enter time period in months"
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              {/* Available Time Per Day */}
              <div>
                <label className="block text-light/80 mb-2 font-medium">
                  Available Time Per Day (minutes)
                </label>
                <input
                  type="number"
                  name="workoutDuration"
                  value={formData.workoutDuration}
                  onChange={handleChange}
                  min="15"
                  max="240"
                  placeholder="Minutes available per day"
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              {/* Workout Days Per Week */}
              <div>
                <label className="block text-light/80 mb-2 font-medium">
                  Workout Days Per Week
                </label>
                <input
                  type="number"
                  name="workoutDaysPerWeek"
                  value={formData.workoutDaysPerWeek}
                  onChange={handleChange}
                  min="1"
                  max="7"
                  placeholder="Days per week (1-7)"
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-light/80 mb-2 font-medium">
                Available Equipment
              </label>
              <textarea
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                placeholder="List any equipment you have access to..."
                className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-20"
              ></textarea>
            </div>

            {/* Medical Constraints */}
            <div>
              <label className="block text-light/80 mb-2 font-medium">
                Medical Conditions
              </label>
              <textarea
                name="healthConditions"
                value={formData.healthConditions}
                onChange={handleChange}
                placeholder="List any injuries, conditions, or limitations..."
                className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-20"
              ></textarea>
            </div>
            <div>
              <label className="block text-light/80 mb-2 font-medium">
                Injury History
              </label>
              <textarea
                name="injuryHistory"
                value={formData.injuryHistory}
                onChange={handleChange}
                placeholder="List any injuries, conditions, or limitations..."
                className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-20"
              ></textarea>
            </div>

            {/* Submit Button */}
            {/* <Link to="/WorkoutPlanDetails"> */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-dark py-3 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center"
            >
              <FiActivity className="mr-2" /> Generate Workout Plan
            </motion.button>
            {/* </Link> */}
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WorkoutPlanForm;
