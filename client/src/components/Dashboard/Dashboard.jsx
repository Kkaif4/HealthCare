import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "@headlessui/react";
import DietPlanForm from "./DietPlanForm"; 
import WorkoutPlanForm from './WorkoutPlanForm'; 

import {
  FiUser,
  FiEdit,
  FiPlus,
  FiActivity,
  FiDroplet,
  FiSettings,
  FiCheckSquare,
} from "react-icons/fi";

const Dashboard = () => {
  const [showDietForm, setShowDietForm] = useState(false);
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [userDetails] = useState({
    name: "John Doe",
    age: 28,
    height: 180,
    weight: 75,
    goal: "Muscle Gain",
    bmi: 23.1,
  });

  return (
    <div className="min-h-screen bg-dark text-light">
      {/* Navbar with Profile Dropdown */}
      <nav className="bg-dark/90 backdrop-blur-md fixed w-full z-50 border-b border-primary/20">
        <div className="mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FitAI Dashboard
            </span>

            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 text-light/80 hover:text-primary transition-colors">
                <FiUser className="h-6 w-6" />
                <span>Profile</span>
              </Menu.Button>

              <Menu.Items className="absolute right-0 mt-2 w-48 bg-dark/90 backdrop-blur-lg rounded-lg shadow-xl border border-primary/20">
                <div className="p-2 space-y-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`w-full text-left px-4 py-2 rounded-md ${
                          active ? "bg-primary/20" : ""
                        }`}
                      >
                        <FiSettings className="inline mr-2" /> Settings
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="pt-20 pb-8 px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Column - User Details (reduced width) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-3 space-y-4"
          >
            <div className="bg-dark/80 backdrop-blur-lg p-4 rounded-xl border border-primary/20">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FiUser className="mr-2 text-primary" /> User Details
              </h2>

              <div className="space-y-4">
                <DetailItem label="Name" value={userDetails.name} />
                <DetailItem label="Age" value={userDetails.age} />
                <DetailItem label="Height" value={`${userDetails.height} cm`} />
                <DetailItem label="Weight" value={`${userDetails.weight} kg`} />
                <DetailItem label="Goal" value={userDetails.goal} />
              </div>

              <button className="mt-6 w-full bg-primary/20 hover:bg-primary/30 text-primary py-2 rounded-lg transition-colors flex items-center justify-center">
                <FiEdit className="mr-2" /> Edit Profile
              </button>
            </div>

            {/* Goal Section */}
            <div className="bg-dark/80 backdrop-blur-lg p-4 rounded-xl border border-primary/20">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FiActivity className="mr-2 text-primary" /> Current Goal
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-dark/70 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-bold mb-2">Primary Goal</h3>
                  <p className="text-light/80">{userDetails.goal}</p>
                </div>

                <button className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-2 rounded-lg transition-colors flex items-center justify-center">
                  <FiEdit className="mr-2" /> Update Goal
                </button>
              </div>
            </div>

            {/* To Do List Button */}
            <button className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-4 rounded-lg transition-colors flex items-center justify-center">
              <FiCheckSquare className="mr-2" /> View To-Do List
            </button>
          </motion.div>

          {/* Center Column - Plans (increased width and full height) */}
          <div className="md:col-span-6 h-full flex flex-col gap-4">
            {/* Current Plans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              <h2 className="text-2xl font-bold mb-4">Current Plans</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <CurrentPlanCard
                  title="Current Diet Plan"
                  progress={65}
                  status="Active"
                />
                <CurrentPlanCard
                  title="Current Workout Plan"
                  progress={40}
                  status="In Progress"
                />
              </div>
            </motion.div>

            {/* Generate New Plans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              <h2 className="text-2xl font-bold mb-4">Generate New Plans</h2>
              <div className="grid md:grid-cols-2 gap-4">
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

          {/* Right Column - BMI Chart (reduced width) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-3"
          >
            <div className="bg-dark/80 backdrop-blur-lg p-4 rounded-xl border border-primary/20">
              <h2 className="text-xl font-bold mb-4">BMI Analysis</h2>
              <div className="relative w-full h-48">
                {/* BMI Chart Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-xl">
                  <span className="text-4xl font-bold text-primary">
                    {userDetails.bmi}
                  </span>
                  <span className="text-light/80 ml-2">BMI</span>
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <BMICategory
                  label="Underweight"
                  range="< 18.5"
                  isCurrent={userDetails.bmi < 18.5}
                />
                <BMICategory
                  label="Normal"
                  range="18.5 - 24.9"
                  isCurrent={userDetails.bmi >= 18.5 && userDetails.bmi <= 24.9}
                />
                <BMICategory
                  label="Overweight"
                  range="25 - 29.9"
                  isCurrent={userDetails.bmi >= 25 && userDetails.bmi <= 29.9}
                />
                <BMICategory
                  label="Obese"
                  range="≥ 30"
                  isCurrent={userDetails.bmi >= 30}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {showDietForm && (
        <DietPlanForm
          onClose={() => setShowDietForm(false)}
          onSubmit={(data) => {
            console.log("Diet Plan Data:", data);
            // TODO: Handle form submission - send to AI service
            setShowDietForm(false);
          }}
        />
      )}

      {showWorkoutForm && (
        <WorkoutPlanForm
          onClose={() => setShowWorkoutForm(false)}
          onSubmit={(data) => {
            console.log("Workout Plan Data:", data);
            // TODO: Handle form submission - send to AI service
            setShowWorkoutForm(false);
          }}
        />
      )}
    </div>
  );
};

// Reusable Components
const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-primary/10">
    <span className="text-light/80">{label}:</span>
    <span className="font-medium">{value}</span>
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

const CurrentPlanCard = ({ title, progress, status }) => (
  <div className="bg-dark/60 border border-primary/20 rounded-xl p-4">
    <h3 className="text-lg font-bold mb-4">{title}</h3>
    <div className="w-full bg-primary/10 rounded-full h-2 mb-4">
      <div
        className="bg-primary h-2 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
    <div className="flex justify-between items-center text-sm">
      <span className="text-light/80">{progress}% Completed</span>
      <span
        className={`px-2 py-1 rounded-full ${
          status === "Active"
            ? "bg-green-500/20 text-green-500"
            : "bg-primary/20 text-primary"
        }`}
      >
        {status}
      </span>
    </div>
  </div>
);

const BMICategory = ({ label, range, isCurrent }) => (
  <div
    className={`flex justify-between items-center p-3 rounded-lg ${
      isCurrent ? "bg-primary/20 border border-primary/30" : "bg-dark/60"
    }`}
  >
    <div>
      <div className="font-medium">{label}</div>
      <div className="text-sm text-light/60">{range}</div>
    </div>
    {isCurrent && <div className="w-2 h-2 bg-primary rounded-full" />}
  </div>
);

export default Dashboard;
