import axios from 'axios';
import { getMe } from './authSerives.js';

/**
 * Helper function to refresh user data
 */
export const refreshUserData = async () => {
  try {
    const response = await getMe();
    if (response?.data) {
      return response.data;
    }
  } catch (error) {
    console.error('Error refreshing user data:', error);
  }
  return null;
};

/**
 * Save diet preferences to the database
 * @param {Object} formData - User's diet preferences data
 * @returns {Promise} - API response
 */
export const saveDietPreferences = async (formData) => {
  try {
    const response = await axios.post('/plans/diet-preferences', formData, {
      withCredentials: true,
    });

    if (!response.data) {
      throw new Error('Failed to save diet preferences');
    }

    await refreshUserData();
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw (
      error.response?.data || { message: 'Failed to save diet preferences' }
    );
  }
};

/**
 * Save workout preferences to the database
 * @param {Object} formData - User's workout preferences data
 * @returns {Promise} - API response
 */
export const saveWorkoutPreferences = async (formData) => {
  try {
    const response = await axios.post('/plans/workout-preferences', formData, {
      withCredentials: true,
    });

    if (!response.data) {
      throw new Error('Failed to save workout preferences');
    }

    await refreshUserData();
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw (
      error.response?.data || { message: 'Failed to save workout preferences' }
    );
  }
};

/**
 * Get user's diet preferences from the database
 * @param {string} userId - User ID
 * @returns {Promise} - API response containing diet preferences
 */
export const getDietPreferences = async (userId) => {
  try {
    const response = await axios.get(`/plans/user-diet-preferences/${userId}`);
    return response;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Error fetching diet preferences:', error);
    throw (
      error.response?.data || { message: 'Failed to fetch diet preferences' }
    );
  }
};

/**
 * Get user's workout preferences from the database
 * @param {string} userId - User ID
 * @returns {Promise} - API response containing workout preferences
 */
export const getWorkoutPreferences = async (userId) => {
  try {
    const response = await axios.get(
      `/plans/user-workout-preferences/${userId}`
    );
    return response;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.log('Error fetching workout preferences:', error.message);
    throw (
      error.response?.data || { message: 'Failed to fetch workout preferences' }
    );
  }
};

/**
 * Generate a diet plan based on user preferences
 * @param {string} userId - User ID
 * @param {Object} preferences - Diet preferences
 * @returns {Promise} - API response with generated diet plan
 */
export const generateDietPlan = async () => {
  try {
    const response = await axios.get(`/plans/generate-diet`);
    console.log('Diet Plan Response:', response);
    return response;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Error generating diet plan:', error);
    throw error.response?.data || { message: 'Failed to generate diet plan' };
  }
};

/**
 * Generate a workout plan based on user preferences
 * @param {string} userId - User ID
 * @param {Object} preferences - Workout preferences
 * @returns {Promise} - API response with generated workout plan
 */

export const generateWorkoutPlan = async () => {
  try {
    const response = await axios.get(`/plans/generate-workout`);
    await refreshUserData();
    return response;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Error generating workout plan:', error);
    throw (
      error.response?.data || { message: 'Failed to generate workout plan' }
    );
  }
};

/**
 * Get a user's diet plan
 * @param {string} userId - User ID
 * @returns {Promise} - API response with user's diet plan
 */
export const getDietPlan = async (userId) => {
  try {
    const response = await axios.get(`/plans/diet/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error.response?.data || { message: 'Failed to fetch diet plan' };
  }
};

/**
 * Get a user's workout plan
 * @param {string} userId - User ID
 * @returns {Promise} - API response with user's workout plan
 */
export const getWorkoutPlan = async (userId) => {
  try {
    const response = await axios.get(`/plans/workout/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error.response?.data || { message: 'Failed to fetch workout plan' };
  }
};
