import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  saveDietPreferences,
  generateDietPlan,
} from "../../services/planServices";

const DietPlanForm = ({ onClose, onPlanGenerated }) => {
  const [isLoading, setLoadin] = useState(false);
  const [formData, setFormData] = useState({
    dietGoal: "",
    dietType: "",
    foodAllergies: "",
    favoriteFoods: "",
    dislikedFoods: "",
    budget: "",
    targetWeight: "",
    timePeriod: "3",
    dietaryRestrictions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadin(true);
    try {
      console.log(formData);
      const preferences = await saveDietPreferences({ formData });
      const DietPlan = await generateDietPlan({
        ...formData,
        preferencesId: preferences.data?._id,
      });
      toast.success("Diet Plan saved successfully");
      if (onPlanGenerated && DietPlan.data) {
        onPlanGenerated(DietPlan.data);
      }
    } catch (error) {
      toast.error("Failed to save diet plan");
      console.error("Error generating diet plan:", error);
    } finally {
      setLoadin(false);
    }
  };

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
          <div className="bg-dark z-10 pb-4 mb-4 border-b border-primary/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold text-light flex items-center">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Generate Diet Plan
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
            {/* Diet Goal Selection */}
            <div>
              <label className="block text-light/80 mb-2 font-medium">Diet Goal</label>
              <select
                name="dietGoal"
                value={formData.dietGoal}
                onChange={handleChange}
                className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="weight-gain">Weight Gain</option>
              </select>
            </div>

            {/* Diet Type Selection */}
            <div>
              <label className="block text-light/80 mb-2 font-medium">
                Diet Type
              </label>
              <select
                name="dietType"
                value={formData.dietType}
                onChange={handleChange}
                className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="vegan">Vegan</option>
                <option value="pescatarian">Pescatarian</option>
              </select>
            </div>

            {/* Two Column Layout for Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Food Allergies */}
              <div>
                <label className="block text-light/80 mb-2 font-medium">
                  Food Allergies
                </label>
                <textarea
                  name="foodAllergies"
                  value={formData.foodAllergies}
                  onChange={handleChange}
                  placeholder="List any food allergies..."
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-20"
                ></textarea>
              </div>

              {/* Favorite Foods */}
              <div>
                <label className="block text-light/80 mb-2 font-medium">
                  Favorite Foods
                </label>
                <textarea
                  name="favoriteFoods"
                  value={formData.favoriteFoods}
                  onChange={handleChange}
                  placeholder="List your favorite foods..."
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-20"
                ></textarea>
              </div>

              {/* Disliked Foods */}
              <div>
                <label className="block text-light/80 mb-2 font-medium">
                  Disliked Foods
                </label>
                <textarea
                  name="dislikedFoods"
                  value={formData.dislikedFoods}
                  onChange={handleChange}
                  placeholder="List foods you dislike..."
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-20"
                ></textarea>
              </div>

              {/* Dietary Restrictions */}
              <div>
                <label className="block text-light/80 mb-2 font-medium">
                  Dietary Restrictions
                </label>
                <textarea
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  placeholder="Any additional dietary restrictions..."
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-20"
                ></textarea>
              </div>
            </div>

            {/* Budget Selection */}
            <div>
              <label className="block text-light/80 mb-2 font-medium">Budget</label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Target Weight and Time Period in a grid */}
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
            </div>

            {/* Submit Button */}
            <Link to ="/diet-plan-details">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-dark py-3 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center"
            >
              <FiCheckCircle className="mr-2" /> Generate Plan
            </motion.button>
            </Link>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Reusable option component for diet goals
const GoalOption = ({ name, value, selected, onChange }) => {
  const formattedValue = value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <label className="cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`p-2 md:p-3 rounded-lg text-center border text-sm md:text-base transition-all ${
          selected
            ? "border-primary bg-primary/20 text-primary font-medium"
            : "border-primary/20 bg-dark/40 text-light/60"
        }`}
      >
        {formattedValue}
      </div>
    </label>
  );
};

export default DietPlanForm;
