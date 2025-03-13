import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import DietPlanDetails from './components/Dashboard/DietPlanDetails.jsx';
import WorkoutPlanDetails from './components/Dashboard/WorkoutPlanDetails.jsx';
import './axiosConfig.js'
const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <div className="bg-dark text-light min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diet-plan-details" element={<DietPlanDetails />} />
          <Route path="/workout-plan-details" element={<WorkoutPlanDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;