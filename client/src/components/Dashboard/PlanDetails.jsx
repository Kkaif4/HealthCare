import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCalendar, FiUser, FiTarget, FiClock, FiCheckCircle } from "react-icons/fi";
import axios from "axios";

const PlanDetails = () => {
  const { planType, planId } = useParams();
  const navigate = useNavigate();
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/${planType}/${planId}`);
        setPlanData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching plan:", err);
        setError("Failed to load the plan. Please try again later.");
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planType, planId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading plan details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark text-light flex items-center justify-center">
        <div className="text-center p-8 bg-dark/80 backdrop-blur-lg rounded-xl border border-primary/20 max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-primary text-dark font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const renderDietPlan = () => (
    <div className="space-y-6">
      <div className="bg-dark/60 border border-primary/20 rounded-xl p-4">
        <h3 className="text-lg font-bold mb-3">Daily Calorie Target</h3>
        <p className="text-2xl font-bold text-primary">{planData.dailyCalories} kcal</p>
        <div className="mt-2 text-light/80">
          <span className="inline-block mr-4">Proteins: {planData.macros.protein}g</span>
          <span className="inline-block mr-4">Carbs: {planData.macros.carbs}g</span>
          <span className="inline-block">Fats: {planData.macros.fats}g</span>
        </div>
      </div>

      <div className="bg-dark/60 border border-primary/20 rounded-xl p-4">
        <h3 className="text-lg font-bold mb-3">Meal Plan</h3>
        <div className="space-y-4">
          {planData.meals.map((meal, index) => (
            <div key={index} className="p-3 bg-dark/70 rounded-lg border border-primary/10">
              <h4 className="font-bold text-primary">{meal.name}</h4>
              <p className="text-sm text-light/80 mb-2">{meal.time} - {meal.calories} kcal</p>
              <ul className="list-disc pl-5 space-y-1">
                {meal.foods.map((food, i) => (
                  <li key={i} className="text-light/90">{food}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {planData.recommendations && (
        <div className="bg-dark/60 border border-primary/20 rounded-xl p-4">
          <h3 className="text-lg font-bold mb-3">Recommendations</h3>
          <ul className="list-disc pl-5 space-y-2">
            {planData.recommendations.map((rec, index) => (
              <li key={index} className="text-light/90">{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderWorkoutPlan = () => (
    <div className="space-y-6">
      <div className="bg-dark/60 border border-primary/20 rounded-xl p-4">
        <h3 className="text-lg font-bold mb-3">Weekly Schedule</h3>
        <p className="text-light/80 mb-4">{planData.frequency} workouts per week</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {planData.schedule.map((day, index) => (
            <div key={index} className={`p-3 rounded-lg border ${day.isRestDay ? 'bg-dark/40 border-primary/10' : 'bg-dark/70 border-primary/20'}`}>
              <h4 className="font-bold">{day.day}</h4>
              {day.isRestDay ? (
                <p className="text-light/70">Rest Day</p>
              ) : (
                <>
                  <p className="text-primary font-medium">{day.focus}</p>
                  <p className="text-sm text-light/80">{day.duration} minutes</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {planData.workouts && planData.workouts.map((workout, index) => (
        <div key={index} className="bg-dark/60 border border-primary/20 rounded-xl p-4">
          <h3 className="text-lg font-bold mb-3">{workout.name}</h3>
          <p className="text-light/80 mb-4">{workout.description}</p>
          
          <div className="space-y-4">
            {workout.exercises.map((exercise, i) => (
              <div key={i} className="p-3 bg-dark/70 rounded-lg border border-primary/10">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-primary">{exercise.name}</h4>
                  <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">
                    {exercise.sets} sets × {exercise.reps} reps
                  </span>
                </div>
                {exercise.notes && <p className="text-sm text-light/80 mt-2">{exercise.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}

      {planData.tips && (
        <div className="bg-dark/60 border border-primary/20 rounded-xl p-4">
          <h3 className="text-lg font-bold mb-3">Tips</h3>
          <ul className="list-disc pl-5 space-y-2">
            {planData.tips.map((tip, index) => (
              <li key={index} className="text-light/90">{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-dark text-light pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary hover:text-primary/80 transition-colors mb-6"
        >
          <FiArrowLeft className="mr-2" /> Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark/80 backdrop-blur-lg p-5 rounded-xl border border-primary/20 mb-6"
        >
          <h1 className="text-2xl font-bold mb-4">
            {planType === "diet" ? "Diet Plan" : "Workout Plan"} Details
          </h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-dark/60 p-3 rounded-lg border border-primary/10">
              <div className="flex items-center text-primary mb-1">
                <FiCalendar className="mr-2" /> Created
              </div>
              <div className="text-sm">{new Date(planData.createdAt).toLocaleDateString()}</div>
            </div>
            
            <div className="bg-dark/60 p-3 rounded-lg border border-primary/10">
              <div className="flex items-center text-primary mb-1">
                <FiUser className="mr-2" /> For
              </div>
              <div className="text-sm">{planData.userName}</div>
            </div>
            
            <div className="bg-dark/60 p-3 rounded-lg border border-primary/10">
              <div className="flex items-center text-primary mb-1">
                <FiTarget className="mr-2" /> Goal
              </div>
              <div className="text-sm">{planData.goal}</div>
            </div>
            
            <div className="bg-dark/60 p-3 rounded-lg border border-primary/10">
              <div className="flex items-center text-primary mb-1">
                <FiClock className="mr-2" /> Duration
              </div>
              <div className="text-sm">{planData.duration} days</div>
            </div>
          </div>

          {planType === "diet" ? renderDietPlan() : renderWorkoutPlan()}
        </motion.div>
      </div>
    </div>
  );
};

export default PlanDetails;