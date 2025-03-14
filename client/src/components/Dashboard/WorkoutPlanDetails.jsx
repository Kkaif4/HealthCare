import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PlanDetails = () => {
  const navigate = useNavigate();
  const [WorkoutPlanData, setWorkoutPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setWorkoutPlanData(user.workoutPlan.text);
          setLoading(false);
        } else {
          console.log("user not found in local storage");
        }
      } catch (err) {
        console.error("Error fetching plan:", err);
        setError("Failed to load the plan. Please try again later.");
        setLoading(false);
      }
    };

    fetchPlan();
  }, [WorkoutPlanData]);

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

  return (
    <div>
      <h2>Your Diet Plan</h2>
      {WorkoutPlanData ? (
        <div dangerouslySetInnerHTML={{ __html: WorkoutPlanData }} />
      ) : (
        <p>No data found</p>
      )}
    </div>
  );
};

export default PlanDetails;
