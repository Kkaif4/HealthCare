import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authSerives';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call the login API function
      const userData = await login(formData.email, formData.password);
      
      if (userData) {
        // Handle successful login
        navigate('/dashboard');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-dark/80 backdrop-blur-lg rounded-2xl p-8 border border-primary/20 shadow-xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-light/80 mt-2">Continue your health journey</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-3 text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-light/80 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-dark/60 border border-primary/20 rounded-lg px-4 py-3 text-light focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-light/80 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-dark/60 border border-primary/20 rounded-lg px-4 py-3 text-light focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Enter your password"
              required
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full bg-primary text-light py-3 rounded-lg font-semibold hover:bg-secondary transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Login'}
          </motion.button>

          <div className="text-center text-light/80 space-y-2">
            <p>
              New to Health Track?{' '}
              <Link
                to="/signup"
                className="text-primary hover:text-secondary transition-colors"
              >
                Create Account
              </Link>
            </p>
            <p className="text-xs">
              By continuing, you agree to our{' '}
              <Link
                to="/terms"
                className="text-primary hover:text-secondary transition-colors"
              >
                Terms
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy"
                className="text-primary hover:text-secondary transition-colors"
              >
                Privacy
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;