import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiChevronUp, FiChevronDown } from 'react-icons/fi';

const MobileMenu = ({
  mobileMenuOpen,
  showUserSection,
  toggleUserSection,
  setMobileMenuOpen,
}) => {
  if (!mobileMenuOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-dark/95 z-40 md:hidden pt-16 px-4">
      <div className="flex flex-col space-y-4 p-4">
        <button
          onClick={toggleUserSection}
          className="flex items-center justify-between w-full bg-primary/20 hover:bg-primary/30 text-primary py-3 px-4 rounded-lg transition-colors">
          <span className="flex items-center">
            <FiUser className="mr-2" /> User Details
          </span>
          {showUserSection ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        <button
          onClick={() => setMobileMenuOpen(false)}
          className="w-full bg-primary text-dark font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors">
          Close Menu
        </button>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
