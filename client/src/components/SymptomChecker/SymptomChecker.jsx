// frontend/src/components/SymptomChecker/SymptomChecker.jsx
import { useState } from 'react';
import api from '../../utils/api';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const response = await api.post('/symptoms/check', { symptoms: symptoms.split(',') });
      setDiagnosis(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Diagnosis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Symptom Checker</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 dark:text-gray-200">
            Enter symptoms (comma separated)
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows="4"
            placeholder="e.g., fever, headache, cough"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          {loading ? 'Analyzing...' : 'Check Symptoms'}
        </button>
      </form>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {diagnosis && (
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Possible Conditions</h2>
          <ul className="list-disc pl-6 space-y-2">
            {diagnosis.conditions.map((condition, index) => (
              <li key={index} className="dark:text-gray-200">
                {condition.name} - {condition.probability}% probability
              </li>
            ))}
          </ul>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg dark:bg-blue-900">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {diagnosis.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;