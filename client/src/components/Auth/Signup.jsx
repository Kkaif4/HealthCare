import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { register } from "../../services/authSerives"; // Update import path

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    medicalHistory: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setAvatar(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const removePhoto = () => {
    setAvatar(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    try {
      const formDataObj = new FormData();
      
      // Append all form fields with proper formatting
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email);
      formDataObj.append("password", formData.password);
      formDataObj.append("age", formData.age);
      formDataObj.append("gender", formData.gender);
      formDataObj.append("weight", formData.weight);
      formDataObj.append("height", formData.height);
      formDataObj.append("medicalHistory", formData.medicalHistory);
      
      // Append avatar if exists
      if (avatar) {
        formDataObj.append("avatar", avatar);
      }
  
      // Debug: Log form data before sending
      for (let [key, value] of formDataObj.entries()) {
        console.log(key, value);
      }
  
      const userData = await register(formDataObj);
      
      if (userData) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.error?.message || 
                          error.response?.data?.message || 
                          "Registration failed. Please check your inputs.";
      setError(errorMessage);
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
        className="w-full max-w-2xl bg-dark/80 backdrop-blur-lg rounded-2xl p-8 border border-primary/20 shadow-xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Health Profile Setup
          </h2>
          <p className="text-light/80 mt-2">
            Create your free health tracking account
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Profile Photo Upload Section */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              {previewUrl ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary flex items-center justify-center bg-dark/40">
                  <img
                    src={previewUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-primary/60 flex items-center justify-center text-light/60 bg-dark/40">
                  <div className="text-center p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 mx-auto mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-xs">Add Photo</span>
                  </div>
                </div>
              )}

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />

              {/* Photo edit/remove button overlay */}
              {previewUrl && (
                <div className="absolute -bottom-2 -right-2 flex space-x-1">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={triggerFileInput}
                    className="bg-primary rounded-full p-2 text-light shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={removePhoto}
                    className="bg-red-500 rounded-full p-2 text-light shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </motion.button>
                </div>
              )}
            </div>

            {!previewUrl && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={triggerFileInput}
                className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm hover:bg-primary/30 transition-colors"
              >
                Upload Profile Photo
              </motion.button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <div className="space-y-6 md:col-span-2">
              <h3 className="text-xl font-semibold text-primary border-b border-primary/20 pb-2">
                Personal Information
              </h3>

              <div>
                <label htmlFor="name" className="block text-light/80 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg px-4 py-3 text-light focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>

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
                  placeholder="Create a strong password"
                  required
                />
                <p className="text-light/60 text-sm mt-1">
                  Use at least 8 characters with letters, numbers and symbols
                </p>
              </div>
            </div>

            {/* Health Information Section */}
            <div className="space-y-6 md:col-span-2">
              <h3 className="text-xl font-semibold text-primary border-b border-primary/20 pb-2">
                Health Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="age" className="block text-light/80 mb-2">
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    max="120"
                    className="w-full bg-dark/60 border border-primary/20 rounded-lg px-4 py-3 text-light focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Years"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-light/80 mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-dark/60 border border-primary/20 rounded-lg px-4 py-3 text-light focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    <option value="" disabled>
                      Select your gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="weight" className="block text-light/80 mb-2">
                    Weight
                  </label>
                  <div className="flex">
                    <input
                      id="weight"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      className="w-full bg-dark/60 border border-primary/20 rounded-l-lg px-4 py-3 text-light focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Weight"
                    />
                    <div className="bg-dark/80 border border-l-0 border-primary/20 rounded-r-lg px-4 py-3 text-light/80">
                      kg
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="height" className="block text-light/80 mb-2">
                    Height
                  </label>
                  <div className="flex">
                    <input
                      id="height"
                      name="height"
                      type="number"
                      value={formData.height}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full bg-dark/60 border border-primary/20 rounded-l-lg px-4 py-3 text-light focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Height"
                    />
                    <div className="bg-dark/80 border border-l-0 border-primary/20 rounded-r-lg px-4 py-3 text-light/80">
                      cm
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="medicalHistory"
                  className="block text-light/80 mb-2"
                >
                  Medical History
                  <span className="text-light/60 text-sm ml-2">(Optional)</span>
                </label>
                <textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-dark/60 border border-primary/20 rounded-lg px-4 py-3 text-light focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="List any relevant medical conditions, allergies, or medications"
                ></textarea>
                <p className="text-light/60 text-sm mt-1">
                  This information will be kept private and helps us personalize
                  your health recommendations
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary text-light py-3 rounded-lg font-semibold hover:bg-secondary transition-colors"
            >
              Create Health Profile
            </motion.button>
          </div>

          <div className="text-center text-light/80 space-y-2">
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-secondary transition-colors"
              >
                Login
              </Link>
            </p>
            <p className="text-xs">
              By creating an account, you agree to our{" "}
              <Link
                to="/terms"
                className="text-primary hover:text-secondary transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-primary hover:text-secondary transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
