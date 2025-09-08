import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, logout, deleteAccount } from '../../../services/authSerives';
import {
  getDietPreferences,
  getWorkoutPreferences,
  generateWorkoutPlan,
} from '../../../services/planServices';

const useDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dietPreferences, setDietPreferences] = useState(null);
  const [workoutPreferences, setWorkoutPreferences] = useState(null);
  const [currentDietPlan, setCurrentDietPlan] = useState(null);
  const [currentWorkoutPlan, setCurrentWorkoutPlan] = useState(null);
  const [isGeneratingWorkoutPlan, setIsGeneratingWorkoutPlan] = useState(false);
  const [showDietForm, setShowDietForm] = useState(false);
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserSection, setShowUserSection] = useState(true);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          navigate('/login');
          return;
        }

        setUser(JSON.parse(storedUser));

        const userData = await getMe();
        if (userData) {
          setUser(userData);
          setCurrentDietPlan(userData.dietPlan);
          setCurrentWorkoutPlan(userData.workoutPlan);
          const [dietPrefsResponse, workoutPrefsResponse] = await Promise.all([
            getDietPreferences(userData._id),
            getWorkoutPreferences(userData._id),
          ]);

          if (dietPrefsResponse?.data) {
            setDietPreferences(dietPrefsResponse.data.data);
          } else {
            setDietPreferences(null);
          }

          if (workoutPrefsResponse?.data) {
            setWorkoutPreferences(workoutPrefsResponse.data.data);
          } else {
            setWorkoutPreferences(null);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          await logout();
        }
        console.log('Error fetching user data:', error.message);
      }
    };

    checkAuthAndLoadData();
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setShowUserSection(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      navigate('/login');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      navigate('/login');
    }
  };

  const refreshUserData = async () => {
    try {
      const response = await getMe();
      if (response?.data) {
        setUser(response.data);
        console.log('Refreshed User Data:', response.data);
        setCurrentDietPlan(response.data.dietPlan);
        setCurrentWorkoutPlan(response.data.workoutPlan);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const handleGenerateDietPlan = () => {
    setShowDietForm(true);
    // Disable background scroll
    document.body.style.overflow = 'hidden';
  };

  const handleGenerateWorkoutPlan = () => {
    setShowWorkoutForm(true);
    // Disable background scroll
    document.body.style.overflow = 'hidden';
  };

  const closeDietForm = () => {
    setShowDietForm(false);
    document.body.style.overflow = 'unset';
  };

  const closeWorkoutForm = () => {
    setShowWorkoutForm(false);
    // Re-enable background scroll
    document.body.style.overflow = 'unset';
  };

  const handleDietFormSubmit = async (formData) => {
    if (!user?._id) return;
    try {
      setDietPreferences(formData);
      await refreshUserData();
      closeDietForm();
      navigate('/diet-plan-details');
    } catch (error) {
      console.error('Error saving diet preferences:', error);
    }
  };

  const handleWorkoutFormSubmit = async (formData) => {
    if (!user?._id) return;

    try {
      setIsGeneratingWorkoutPlan(true);
      const response = await generateWorkoutPlan(user._id, formData);
      if (response?.data) {
        await refreshUserData();
        closeWorkoutForm();
        navigate('/workout-plan-details');
      }
    } catch (error) {
      console.error('Error generating workout plan:', error);
    } finally {
      setIsGeneratingWorkoutPlan(false);
    }
  };

  const handleCurrentDietPlanDetails = () => {
    navigate('/diet-plan-details');
  };

  const handleCurrentWorkoutPlanDetails = () => {
    navigate('/workout-plan-details');
  };

  return {
    user,
    dietPreferences,
    workoutPreferences,
    currentDietPlan,
    currentWorkoutPlan,
    isGeneratingWorkoutPlan,
    showDietForm,
    showWorkoutForm,
    mobileMenuOpen,
    setMobileMenuOpen,
    showUserSection,
    setShowUserSection,
    windowWidth,
    handleLogout,
    handleDeleteAccount,
    handleGenerateDietPlan,
    handleGenerateWorkoutPlan,
    handleCurrentDietPlanDetails,
    handleCurrentWorkoutPlanDetails,
    closeDietForm,
    closeWorkoutForm,
    handleDietFormSubmit,
    handleWorkoutFormSubmit,
  };
};

export default useDashboard;
