import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu } from "@headlessui/react";
import DietPlanForm from "./DietPlanForm";
import WorkoutPlanForm from "./WorkoutPlanForm";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authSerives.js";
import {
  FiUser,
  FiEdit,
  FiPlus,
  FiActivity,
  FiDroplet,
  FiCheckSquare,
  FiCalendar,
  FiCheck,
  FiTrash2,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiLogOut,
} from "react-icons/fi";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showDietForm, setShowDietForm] = useState(false);
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [showToDoList, setShowToDoList] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserSection, setShowUserSection] = useState(true);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [todos, setTodos] = useState([
    { id: 1, text: "Drink 2L of water", completed: false },
    { id: 2, text: "Complete today's workout", completed: false },
    { id: 3, text: "Prepare meals for tomorrow", completed: true },
  ]);
  const [newTodo, setNewTodo] = useState("");
  const [user, setUser] = useState(() => {
    try {
      const User = localStorage.getItem("user");
      return User || null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error.message);
    }
  });
  const [diet, setDiet] = useState(null);
  const [dietPreferences, setDietPreferences] = useState(null);
  const [bmi, setBmi] = useState(0);

  // Fetch user data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error.message);
      }
    }
  }, []);
  useEffect(() => {
    const storedPreferences = localStorage.getItem("dietPreferences");
    if (storedPreferences) {
      try {
        setDietPreferences(JSON.parse(storedPreferences));
      } catch (error) {
        console.error(
          "Error parsing diet preferences from localStorage:",
          error.message
        );
        setDietPreferences({});
      }
    } else {
      console.log("Couldn't find any preferences");
      setDietPreferences({});
    }
  }, []);
  const handleLogout = async () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      // Auto-hide user section on mobile
      if (window.innerWidth < 768) {
        setShowUserSection(false);
      } else {
        setShowUserSection(true);
      }
    };

    window.addEventListener("resize", handleResize);
    // Initial check
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  //calculate user BMI
  useEffect(() => {
    const calculateBMI = () => {
      const heightInMeters = user.height / 100;
      const calculatedBMI = (
        user.weight /
        (heightInMeters * heightInMeters)
      ).toFixed(1);
      setBmi(parseFloat(calculatedBMI));
    };
    calculateBMI();
  }, [user]);

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;
    const newTodoItem = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    };
    setTodos([...todos, newTodoItem]);
    setNewTodo("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleUserSection = () => {
    setShowUserSection(!showUserSection);
  };

  // Render the To-Do list component
  const renderToDoList = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-dark/80 backdrop-blur-lg p-4 rounded-xl border border-primary/20 mb-4"
    >
      <h2 className="text-xl font-bold mb-3 flex items-center">
        <FiCheckSquare className="mr-2 text-primary" /> To-Do List
      </h2>
      <form onSubmit={addTodo} className="flex mb-3">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-dark/60 border border-primary/30 rounded-l-lg p-2 text-light focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          className="bg-primary text-dark font-medium px-3 rounded-r-lg hover:bg-primary/90 transition-colors"
        >
          <FiPlus />
        </button>
      </form>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-2 bg-dark/60 border border-primary/10 rounded-lg"
          >
            <div className="flex items-center">
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`h-5 w-5 rounded border flex items-center justify-center mr-2 
                  ${
                    todo.completed
                      ? "bg-primary border-primary"
                      : "border-primary/30 bg-dark/40"
                  }`}
              >
                {todo.completed && <FiCheck size={12} className="text-dark" />}
              </button>
              <span
                className={todo.completed ? "line-through text-light/50" : ""}
              >
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-light/50 hover:text-red-400 transition-colors"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-dark text-light">
      {/* Navbar */}
      <nav className="bg-dark/90 backdrop-blur-md fixed w-full z-50 border-b border-primary/20">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button
              className="md:hidden text-light/80 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>

            {/* Logo - Smaller on mobile */}
            <a
              href="/"
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              OptiLife AI
            </a>

            {/* Dashboard text - Hidden on mobile */}
            <span className="hidden md:block text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Dashboard
            </span>

            {/* Profile Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 text-light/80 hover:text-primary transition-colors">
                <FiUser className="h-6 w-6" />
                <span className="hidden md:inline">Profile</span>
              </Menu.Button>

              <Menu.Items className="absolute right-0 mt-2 w-48 bg-dark/90 backdrop-blur-lg rounded-lg shadow-xl border border-primary/20">
                <div className="p-2 space-y-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 rounded-md ${
                          active ? "bg-primary/20" : ""
                        }`}
                      >
                        <FiLogOut className="inline mr-2" /> Log Out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-dark/95 z-40 md:hidden pt-16 px-4"
        >
          <div className="flex flex-col space-y-4 p-4">
            <button
              onClick={toggleUserSection}
              className="flex items-center justify-between w-full bg-primary/20 hover:bg-primary/30 text-primary py-3 px-4 rounded-lg transition-colors"
            >
              <span className="flex items-center">
                <FiUser className="mr-2" /> User Details
              </span>
              {showUserSection ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            <button
              onClick={() => setShowToDoList(!showToDoList)}
              className="flex items-center justify-between w-full bg-primary/20 hover:bg-primary/30 text-primary py-3 px-4 rounded-lg transition-colors"
            >
              <span className="flex items-center">
                <FiCheckSquare className="mr-2" /> To-Do List
              </span>
              {showToDoList ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-primary text-dark font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Close Menu
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Column - Collapsible on mobile */}
          {showUserSection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:col-span-3 space-y-4"
            >
              <div className="bg-dark/80 backdrop-blur-lg p-4 rounded-xl border border-primary/20">
                <h2 className="text-xl font-bold mb-3 flex items-center">
                  <FiUser className="mr-2 text-primary" /> User Details
                </h2>
                {/* Fetching User data */}
                {user ? (
                  <div className="space-y-2">
                    <DetailItem label="Name" value={user.name} />
                    <DetailItem label="Age" value={user.age} />
                    <DetailItem label="Height" value={`${user.height} cm`} />
                    <DetailItem label="Weight" value={`${user.weight} kg`} />
                  </div>
                ) : (
                  <p className="text-light/80 text-center">
                    No user data found.
                  </p>
                )}
              </div>

              <div className="bg-dark/80 backdrop-blur-lg p-4 rounded-xl border border-primary/20">
                <h2 className="text-xl font-bold mb-3 flex items-center">
                  <FiActivity className="mr-2 text-primary" /> Current Goal
                </h2>
                <div className="space-y-3">
                  <div className="p-3 bg-dark/70 rounded-lg border border-primary/20">
                    <p className="text-light/80">
                      <b>Workout Goal: </b>
                      {dietPreferences?.dietGoal || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hide button on mobile - we have it in menu instead */}
              <button
                onClick={() => setShowToDoList(!showToDoList)}
                className="hidden md:flex w-full bg-primary/20 hover:bg-primary/30 text-primary py-3 rounded-lg transition-colors items-center justify-center"
              >
                <FiCheckSquare className="mr-2" />
                {showToDoList ? "Hide To-Do List" : "View To-Do List"}
              </button>
            </motion.div>
          )}

          {/* Mobile toggle button for user section - only visible outside mobile menu */}
          {windowWidth < 768 && !mobileMenuOpen && (
            <button
              onClick={toggleUserSection}
              className="mb-4 w-full bg-primary/20 hover:bg-primary/30 text-primary py-2 rounded-lg transition-colors flex items-center justify-center md:hidden"
            >
              {showUserSection ? (
                <>
                  <FiChevronUp className="mr-2" /> Hide User Details
                </>
              ) : (
                <>
                  <FiChevronDown className="mr-2" /> Show User Details
                </>
              )}
            </button>
          )}

          {/* Center Column - Takes full width on mobile */}
          <div
            className={`${
              showUserSection ? "md:col-span-6" : "md:col-span-9"
            } h-full flex flex-col gap-4`}
          >
            {/* To-Do List for mobile view - only shown above Current Plans section on mobile */}
            {windowWidth < 768 && showToDoList && renderToDoList()}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-4">Current Plans</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-dark/60 border border-primary/20 rounded-xl p-4 hover:shadow-lg hover:shadow-primary/5 transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold">Current Diet Plan</h3>
                    <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-sm">
                      Active
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-light/80">
                      <FiCalendar className="mr-2" /> Created:
                      {new Date(user.dietPlan?.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>
                    <Link to="/diet-plan-details">
                      <button className="w-full mt-2 bg-primary/20 hover:bg-primary/30 text-primary py-2 rounded-lg transition-colors flex items-center justify-center">
                        <FiEdit className="mr-2" /> View Details
                      </button>
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-dark/60 border border-primary/20 rounded-xl p-4 hover:shadow-lg hover:shadow-primary/5 transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold">Current Workout Plan</h3>
                    <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-sm">
                      Active
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-light/80">
                      <FiCalendar className="mr-2" /> Created:
                      {new Date(user.workoutPlan?.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>
                    <Link to="/workout-plan-details">
                      <button className="w-full mt-2 bg-primary/20 hover:bg-primary/30 text-primary py-2 rounded-lg transition-colors flex items-center justify-center">
                        <FiEdit className="mr-2" /> View Details
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold mb-4">Generate New Plans</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PlanCard
                  icon={<FiDroplet className="h-8 w-8" />}
                  title="Diet Plan"
                  description="Create personalized nutrition plan based on your goals"
                  onClick={() => setShowDietForm(true)}
                />
                <PlanCard
                  icon={<FiActivity className="h-8 w-8" />}
                  title="Workout Plan"
                  description="Get custom exercise routine tailored for you"
                  onClick={() => setShowWorkoutForm(true)}
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Conditionally displayed based on screen size */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${showUserSection ? "md:col-span-3" : "md:col-span-3"}`}
          >
            <div className="bg-dark/80 backdrop-blur-lg p-4 rounded-xl border border-primary/20">
              <h2 className="text-xl font-bold mb-4">BMI Analysis</h2>
              <div className="relative w-full h-52 mb-4">
                <svg viewBox="0 0 200 120" className="w-full">
                  <rect
                    x="10"
                    y="90"
                    width="180"
                    height="10"
                    rx="5"
                    fill="#1a1a1a"
                  />
                  <rect
                    x="10"
                    y="90"
                    width="45"
                    rx="5"
                    height="10"
                    fill="#3498db"
                  />
                  <rect
                    x="55"
                    y="90"
                    width="45"
                    rx="0"
                    height="10"
                    fill="#2ecc71"
                  />
                  <rect
                    x="100"
                    y="90"
                    width="45"
                    rx="0"
                    height="10"
                    fill="#f1c40f"
                  />
                  <rect
                    x="145"
                    y="90"
                    width="45"
                    rx="5"
                    height="10"
                    fill="#e74c3c"
                  />

                  <text
                    x="32.5"
                    y="110"
                    fontSize="8"
                    textAnchor="middle"
                    fill="#3498db"
                  >
                    Underweight
                  </text>
                  <text
                    x="32.5"
                    y="120"
                    fontSize="8"
                    textAnchor="middle"
                    fill="#fff"
                  >
                    (&lt;18.5)
                  </text>
                  <text
                    x="77.5"
                    y="110"
                    fontSize="8"
                    textAnchor="middle"
                    fill="#2ecc71"
                  >
                    Normal
                  </text>
                  <text
                    x="77.5"
                    y="120"
                    fontSize="8"
                    textAnchor="middle"
                    fill="#fff"
                  >
                    (18.5-24.9)
                  </text>
                  <text
                    x="122.5"
                    y="110"
                    fontSize="8"
                    textAnchor="middle"
                    fill="#f1c40f"
                  >
                    Overweight
                  </text>
                  <text
                    x="122.5"
                    y="120"
                    fontSize="8"
                    textAnchor="middle"
                    fill="#fff"
                  >
                    (25-29.9)
                  </text>
                  <text
                    x="167.5"
                    y="110"
                    fontSize="8"
                    textAnchor="middle"
                    fill="#e74c3c"
                  >
                    Obese
                  </text>
                  <text
                    x="167.5"
                    y="120"
                    fontSize="8"
                    textAnchor="middle"
                    fill="#fff"
                  >
                    (≥30)
                  </text>

                  <motion.g
                    initial={{ x: 10 }}
                    animate={{
                      x: Math.min(Math.max(10 + (bmi - 10) * 5, 10), 190),
                    }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    <path d="M0,90 L5,80 L-5,80 Z" fill="white" />
                    <circle
                      cy="60"
                      r="20"
                      fill="rgba(255,255,255,0.1)"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      y="63"
                      fontSize="12"
                      textAnchor="middle"
                      fill="white"
                      fontWeight="bold"
                    >
                      {bmi}
                    </text>
                    <text y="50" fontSize="8" textAnchor="middle" fill="white">
                      BMI
                    </text>
                  </motion.g>
                </svg>
              </div>

              <div className="space-y-2">
                <div
                  className={`p-3 rounded-lg transition-colors duration-300 ${
                    bmi < 18.5
                      ? "bg-blue-500/20 border border-blue-500/30"
                      : bmi >= 18.5 && bmi < 25
                      ? "bg-green-500/20 border border-green-500/30"
                      : bmi >= 25 && bmi < 30
                      ? "bg-yellow-500/20 border border-yellow-500/30"
                      : "bg-red-500/20 border border-red-500/30"
                  }`}
                >
                  <div className="font-bold mb-1">
                    {bmi < 18.5
                      ? "Underweight"
                      : bmi >= 18.5 && bmi < 25
                      ? "Normal Weight"
                      : bmi >= 25 && bmi < 30
                      ? "Overweight"
                      : "Obese"}
                  </div>
                  <div className="text-sm text-light/80">
                    Your BMI is {bmi}, which is considered
                    {bmi < 18.5
                      ? " below the healthy range."
                      : bmi >= 18.5 && bmi < 25
                      ? " within the healthy range."
                      : bmi >= 25 && bmi < 30
                      ? " above the healthy range."
                      : " well above the healthy range."}
                  </div>
                </div>

                <div className="p-3 bg-dark/60 rounded-lg">
                  <div className="text-sm text-light/80">
                    <strong>BMI</strong> = weight(kg) / height(m)²
                  </div>
                  <div className="text-sm text-light/80 mt-1">
                    {user.weight}kg / ({user.height / 100})² = {bmi}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* To-Do List Section - Only visible in desktop view and when activated */}
        {windowWidth >= 768 && showToDoList && renderToDoList()}
      </div>

      {/* Modals */}
      {showDietForm && (
        <DietPlanForm
          onClose={() => setShowDietForm(false)}
          onSubmit={(data) => {
            console.log("Diet Plan Data:", data);
            setShowDietForm(false);
          }}
        />
      )}

      {showWorkoutForm && (
        <WorkoutPlanForm
          onClose={() => setShowWorkoutForm(false)}
          onSubmit={(data) => {
            console.log("Workout Plan Data:", data);
            setShowWorkoutForm(false);
          }}
        />
      )}
    </div>
  );
};

// Reusable Components
const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-1 border-b border-primary/10">
    <span className="text-light/80">{label}:</span>
    <span className="font-medium">{value || "N/A"}</span>
  </div>
);

const PlanCard = ({ icon, title, description, onClick }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-dark/60 hover:bg-dark/80 border border-primary/20 rounded-xl p-4 transition-all cursor-pointer"
    onClick={onClick}
  >
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-light/80">{description}</p>
    <button className="mt-4 text-primary flex items-center">
      <FiPlus className="mr-2" /> Generate Plan
    </button>
  </motion.div>
);

export default Dashboard;
