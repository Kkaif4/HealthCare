// frontend/src/components/Dashboard/Dashboard.jsx
import { useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

const Dashboard = () => {
  const { user } = AuthContext();
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/users/health-data');
        setHealthData(response.data);
      } catch (err) {
        console.error('Error fetching health data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateBMI = () => {
    if (!user?.height || !user?.weight) return 'N/A';
    const heightInMeters = user.height / 100;
    return (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Welcome, {user?.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* BMI Card */}
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">BMI</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {calculateBMI()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {user?.height && user?.weight 
              ? `Based on ${user.weight}kg and ${user.height}cm`
              : 'Update your profile to calculate BMI'}
          </p>
        </div>

        {/* Diet Plan Card */}
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Current Diet Plan</h3>
          {healthData?.dietPlan ? (
            <div>
              <p className="text-gray-800 dark:text-gray-200">{healthData.dietPlan.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {healthData.dietPlan.calories} calories/day
              </p>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No active diet plan</p>
          )}
        </div>

        {/* Workout Plan Card */}
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Workout Plan</h3>
          {healthData?.workoutPlan ? (
            <div>
              <p className="text-gray-800 dark:text-gray-200">
                {healthData.workoutPlan.duration} minutes/day
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {healthData.workoutPlan.daysPerWeek} days/week
              </p>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No active workout plan</p>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Activities</h3>
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        ) : (
          <div className="space-y-2">
            {healthData?.recentActivities?.map((activity, index) => (
              <div key={index} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                <span className="text-sm text-gray-600 dark:text-gray-400">{activity}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;