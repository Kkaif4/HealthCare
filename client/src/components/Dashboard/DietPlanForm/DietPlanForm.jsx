import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FiX, FiCheck } from 'react-icons/fi';

const DietPlanForm = ({ isOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    dietGoal: '',
    dietType: '',
    foodAllergies: [],
    favoriteFoods: '',
    dislikedFoods: '',
    budget: '',
    targetWeight: '',
    timePeriod: '',
    dietaryRestrictions: []
  });

  const dietaryOptions = [
    'Gluten-Free', 'Dairy-Free', 'Nut-Free', 
    'Low-Carb', 'Low-Fat', 'Kosher', 'Halal'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Diet Plan Data:', formData);
    closeModal();
  };

  const handleCheckboxChange = (option) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(option)
        ? prev.dietaryRestrictions.filter(item => item !== option)
        : [...prev.dietaryRestrictions, option]
    }));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen bg-dark/90 backdrop-blur-sm">
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <div className="relative bg-dark/90 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full mx-4 border border-primary/20">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-light/80 hover:text-primary"
          >
            <FiX className="h-6 w-6" />
          </button>

          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Create New Diet Plan
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Form Fields */}
              {/* ... (keep all the form fields from your original code) ... */}
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2 border border-primary/20 text-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-light rounded-lg hover:bg-secondary transition-colors flex items-center"
              >
                <FiCheck className="mr-2" />
                Generate Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default DietPlanForm;