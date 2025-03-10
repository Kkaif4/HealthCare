import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const DietPlanForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    dietGoal: "weight-loss",
    dietType: "non-vegetarian",
    foodAllergies: "",
    favoriteFoods: "",
    dislikedFoods: "",
    budget: "medium",
    targetWeight: "",
    timePeriod: "3",
    dietaryRestrictions: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl mx-2 my-4">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-dark border border-primary/20 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-light flex items-center">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Generate Diet Plan
              </span>
            </h2>
            <button 
              onClick={onClose}
              className="text-light/60 hover:text-primary transition-colors"
            >
              <FiArrowLeft className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Diet Goal Selection */}
            <div>
              <label className="block text-light/80 mb-2 font-medium">Diet Goal</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["weight-loss", "muscle-gain", "maintenance", "weight-gain"].map(goal => (
                  <GoalOption
                    key={goal}
                    name="dietGoal"
                    value={goal}
                    selected={formData.dietGoal === goal}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </div>

            {/* Diet Type Selection */}
            <div>
              <label className="block text-light/80 mb-2 font-medium">Diet Type</label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Food Allergies */}
              <div>
                <label className="block text-light/80 mb-2 font-medium">Food Allergies</label>
                <textarea
                  name="foodAllergies"
                  value={formData.foodAllergies}
                  onChange={handleChange}
                  placeholder="List any food allergies..."
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-24"
                ></textarea>
              </div>

              {/* Favorite Foods */}
              <div>
                <label className="block text-light/80 mb-2 font-medium">Favorite Foods</label>
                <textarea
                  name="favoriteFoods"
                  value={formData.favoriteFoods}
                  onChange={handleChange}
                  placeholder="List your favorite foods..."
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-24"
                ></textarea>
              </div>

              {/* Disliked Foods */}
              <div>
                <label className="block text-light/80 mb-2 font-medium">Disliked Foods</label>
                <textarea
                  name="dislikedFoods"
                  value={formData.dislikedFoods}
                  onChange={handleChange}
                  placeholder="List foods you dislike..."
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-24"
                ></textarea>
              </div>

              {/* Dietary Restrictions */}
              <div>
                <label className="block text-light/80 mb-2 font-medium">Dietary Restrictions</label>
                <textarea
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  placeholder="Any additional dietary restrictions..."
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-24"
                ></textarea>
              </div>
            </div>

            {/* Budget Selection */}
            <div>
              <label className="block text-light/80 mb-2 font-medium">Budget</label>
              <div className="flex items-center space-x-4">
                {["low", "medium", "high"].map(option => (
                  <label key={option} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="budget"
                      value={option}
                      checked={formData.budget === option}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className={`px-4 py-2 rounded-lg text-sm ${formData.budget === option ? 'bg-primary text-dark font-medium' : 'bg-dark/40 text-light/60 border border-primary/20'}`}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Target Weight */}
            <div>
              <label className="block text-light/80 mb-2 font-medium">Target Weight (kg)</label>
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
              <label className="block text-light/80 mb-2 font-medium">Time Period (months)</label>
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

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary to-secondary text-dark py-3 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center"
            >
              <FiCheckCircle className="mr-2" /> Generate Plan
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Reusable option component for diet goals
const GoalOption = ({ name, value, selected, onChange }) => {
  const formattedValue = value.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

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
      <div className={`p-3 rounded-lg text-center border transition-all ${
        selected 
          ? 'border-primary bg-primary/20 text-primary font-medium' 
          : 'border-primary/20 bg-dark/40 text-light/60'
      }`}>
        {formattedValue}
      </div>
    </label>
  );
};

export default DietPlanForm;