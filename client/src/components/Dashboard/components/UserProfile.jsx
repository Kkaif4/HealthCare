import React from 'react';
import { FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-1 border-b border-primary/10">
    <span className="text-light/80">{label}:</span>
    <span className="font-medium">{value || 'N/A'}</span>
  </div>
);

const UserProfile = ({ user, dietPreferences, workoutPreferences }) => {
  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="bg-dark/80 backdrop-blur-lg p-4 rounded-xl border border-primary/20">
        <h2 className="text-xl font-bold mb-3 flex items-center">
          <FiUser className="mr-2 text-primary" /> User Details
        </h2>
        <div className="space-y-2">
          <DetailItem label="Name" value={user.name} />
          <DetailItem label="Age" value={user.age} />
          <DetailItem label="Height" value={`${user.height} cm`} />
          <DetailItem label="Weight" value={`${user.weight} kg`} />
        </div>
      </div>

      <div className="bg-dark/80 backdrop-blur-lg p-4 rounded-xl border border-primary/20">
        <h2 className="text-xl font-bold mb-3 flex items-center">
          <FiUser className="mr-2 text-primary" /> Current Goal
        </h2>
        <div className="space-y-3">
          <div className="p-3 bg-dark/70 rounded-lg border border-primary/20">
            <p className="text-light/80">
              <b>Diet Goal: </b>
              {dietPreferences?.data?.dietGoal || 'Not specified'}
            </p>
            <p className="text-light/80">
              <b>Workout Goal: </b>
              {workoutPreferences?.data?.workoutGoal || 'Not specified'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
