import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import {
  generateDietPlan,
  refreshUserData,
  saveDietPreferences,
} from '../../services/planServices';

const DietPlanForm = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    dietGoal: '',
    dietType: '',
    foodAllergies: '',
    favoriteFoods: '',
    dislikedFoods: '',
    budget: '',
    targetWeight: '',
    timePeriod: '',
    dietaryRestrictions: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [error, setError] = useState(null);

  const validateForm = () => {
    if (!formData.dietGoal) return 'Diet Goal is required';
    if (!formData.dietType || formData.dietType === 'select')
      return 'Diet Type is required';
    if (!formData.budget || formData.budget === 'select')
      return 'Budget is required';
    if (!formData.targetWeight) return 'Target Weight is required';
    if (!formData.timePeriod) return 'Time Period is required';
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const cleanedFormData = {
        ...formData,
        foodAllergies: formData.foodAllergies
          ? formData.foodAllergies
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        favoriteFoods: formData.favoriteFoods
          ? formData.favoriteFoods
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        dislikedFoods: formData.dislikedFoods
          ? formData.dislikedFoods
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        targetWeight: Number(formData.targetWeight),
        timePeriod: Number(formData.timePeriod),
      };
      const prefs = await saveDietPreferences(cleanedFormData);
      console.log('Preferences saved:', prefs);
      const plan = await generateDietPlan();
      console.log('Diet Plan generated:', plan);
      await refreshUserData();
      onClose();
      navigate('/diet-plan-details');
    } catch (error) {
      setError(
        error.message || 'Failed to save diet preferences. Please try again.'
      );
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dark text-light backdrop-blur-md">
        <div className="text-center p-6 bg-dark/90 rounded-xl border border-primary/20 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg font-semibold">
            Generating your personalized diet plan...
          </p>
          <p className="mt-2 text-sm text-light/60">
            This may take a few moments
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-md overflow-y-auto p-4">
      <div className="relative w-full max-w-3xl mx-auto my-4">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-dark border border-primary/20 rounded-xl shadow-lg p-4 md:p-6 max-h-[90vh] overflow-y-auto">
          <div className="bg-dark z-10 pb-4 mb-4 border-b border-primary/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold text-light flex items-center">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Generate Diet Plan
                </span>
              </h2>
              <button
                onClick={onClose}
                className="text-light/60 hover:text-primary transition-colors">
                <FiArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Diet Goal Selection */}
            <div>
              <label className="block text-light/80 mb-2 font-medium">
                Diet Goal
              </label>
              <select
                name="dietGoal"
                value={formData.dietGoal}
                onChange={handleChange}
                required
                className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Select your Diet Goal</option>
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
                className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="select">Select your Diet Type</option>
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
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-20"></textarea>
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
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-20"></textarea>
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
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-20"></textarea>
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
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-20"></textarea>
              </div>
            </div>

            {/* Budget Selection */}
            <div>
              <label className="block text-light/80 mb-2 font-medium">
                Budget
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="select">Select your budget</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Target Weight and Time Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-light/80 mb-2 font-medium">
                  Target Weight (kg)
                </label>
                <input
                  type="number"
                  name="targetWeight"
                  value={formData.targetWeight}
                  onChange={handleChange}
                  required
                  placeholder="Enter target weight"
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-light/80 mb-2 font-medium">
                  Time Period (months)
                </label>
                <input
                  type="number"
                  name="timePeriod"
                  value={formData.timePeriod}
                  onChange={handleChange}
                  required
                  min="1"
                  max="24"
                  placeholder="Enter time period in months"
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg p-3 text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary to-secondary text-dark py-3 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center">
              <FiCheckCircle className="mr-2" /> Generate Plan
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DietPlanForm;
