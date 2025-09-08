import { useState, useEffect } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import "./Navbar.css";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);
  
  return (
    <nav className="bg-dark/90 backdrop-blur-md fixed w-full z-50 border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="navbar flex items-center justify-between">
          {/* Logo */}
          <Link
            smooth
            to="#"
            className="flex items-center"
            onClick={() => window.location.reload()}
          >
            <span className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              OptiLife AI
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              smooth
              to="#features"
              className="text-light/80 hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              smooth
              to="#how-it-works"
              className="text-light/80 hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              smooth
              to="#team"
              className="text-light/80 hover:text-primary transition-colors"
            >
              About Us
            </Link>
            {!isLoggedIn && (
              <Link
                to="/login"
                className="bg-primary text-light px-6 py-2 rounded-full hover:bg-secondary transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-light/80"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              smooth
              to="#features"
              className="block text-light/80 hover:text-primary"
            >
              Features
            </Link>
            <Link
              smooth
              to="#how-it-works"
              className="block text-light/80 hover:text-primary"
            >
              How It Works
            </Link>
            <Link
              smooth
              to="#AboutUs"
              className="block text-light/80 hover:text-primary"
            >
              About Us
            </Link>

            <Link
              to="/login"
              className="bg-primary text-light px-6 py-2 rounded-full w-full text-center block"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
