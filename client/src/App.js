import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import Vision from './components/Vision.jsx';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import TermsAndConditions from './components/Auth/TermsAndConditions.jsx';
import PrivacyPolicy from './components/Auth/PricevyPolicy.jsx';
import Dashboard from './components/Dashboard/Dashboard';
import DietPlanDetails from './components/Dashboard/DietPlanDetails.jsx';
import WorkoutPlanDetails from './components/Dashboard/WorkoutPlanDetails.jsx';
import Blog from './components/Blog.jsx';
import './axiosConfig.js';
const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <Vision />
      {/* <Testimonials /> */}
      <Footer />
    </>
  );
};

// 404 Component
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-red-500">404</h1>
      <p className="text-lg mt-2">Page Not Found</p>
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <div className="bg-dark text-light min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diet-plan-details"
            element={
              <ProtectedRoute>
                <DietPlanDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout-plan-details"
            element={
              <ProtectedRoute>
                <WorkoutPlanDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/blog-page" element={<Blog />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
