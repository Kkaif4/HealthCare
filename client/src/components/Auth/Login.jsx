import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "../../services/authSerives.js";
const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async ({ email, password }) => {
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error in login:", error);
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
          <p className="text-light/80 mt-2">
            Login to continue your fitness journey
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(submit)}>
          <div>
            <label className="block text-light/80 mb-2">Email</label>
            <input
              type="email"
              {...register("email", { required: "email is required" })}
              className="w-full bg-dark/60 border border-primary/20 rounded-lg px-4 py-3 text-light focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-light/80 mb-2">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full bg-dark/60 border border-primary/20 rounded-lg px-4 py-3 text-light focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Error Message  */}
          {/* {error && <p className="text-red-500 text-sm text-center">{error}</p>} */}

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-light py-3 rounded-lg font-semibold hover:bg-secondary transition-colors"
          >
            {isLoading ? "Logging in..." : "Login"}
          </motion.button>

          <p className="text-center text-light/80">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:text-secondary transition-colors"
            >
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
