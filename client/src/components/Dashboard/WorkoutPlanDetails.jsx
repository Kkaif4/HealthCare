import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getMe } from "../../services/authSerives.js";
const PlanDetails = ({ onClose }) => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        console.log("hello");
        await getMe();
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
        console.log(storedUser);
        setLoading(false);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
    setLoading(false);
  }, []);

  if (isLoading) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-md overflow-y-auto p-4"
    >
      <div className="relative w-full max-w-3xl mx-auto my-4 scrollbar-hide">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-dark border border-primary/20 rounded-xl shadow-lg p-4 md:p-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="bg-dark z-10 pb-4 mb-4 border-b border-primary/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold text-light flex items-center">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  My Workout Plan
                </span>
              </h2>
              <Link to="/dashboard">
                <button className="text-light/60 hover:text-primary transition-colors">
                  <FiArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </Link>
            </div>
          </div>
          {user && user.workoutPlan ? (
            <div dangerouslySetInnerHTML={{ __html: user.workoutPlan.text }} />
          ) : (
            <p>Loading diet plan...</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlanDetails;
