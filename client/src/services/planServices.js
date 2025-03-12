import API from './axios.js';

export const setDietPreferences = async (formData) => {
    try {
        const response = await API.post('/plans/diet-preferences', formData);
        return response.data;
    } catch (error) {
        console.error('Error fetching diet preferences:', error.message);
    }
}