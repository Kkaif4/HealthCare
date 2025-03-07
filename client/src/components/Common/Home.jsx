// frontend/src/components/Common/Home.jsx
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center py-20 px-4">
      <h1 className="text-4xl font-bold mb-6 dark:text-white">Your Personal Health Companion</h1>
      <p className="text-xl text-gray-600 mb-8 dark:text-gray-300">
        Get personalized diet plans, workout routines, and health diagnostics
      </p>
      <div className="space-x-4">
        <Link
          to="/signup"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;