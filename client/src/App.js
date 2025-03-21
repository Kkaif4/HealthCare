import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Vision from "./components/Vision.jsx";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import TermsAndConditions from "./components/Auth/TermsAndConditions.jsx";
import PrivacyPolicy from "./components/Auth/PricevyPolicy.jsx";
import Dashboard from "./components/Dashboard/Dashboard";
import DietPlanDetails from "./components/Dashboard/DietPlanDetails.jsx";
import WorkoutPlanDetails from "./components/Dashboard/WorkoutPlanDetails.jsx";
import Blog from "./components/Blog.jsx";
import "./axiosConfig.js";
const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <Vision />
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
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diet-plan-details" element={<DietPlanDetails />} />
          <Route
            path="/workout-plan-details"
            element={<WorkoutPlanDetails />}
          />
          <Route path="/blog-page" element={<Blog />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
