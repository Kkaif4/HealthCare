import React from 'react';
import { Menu } from '@headlessui/react';
import { FiUser, FiLogOut } from 'react-icons/fi';

const ProfileMenu = ({ onLogout, onDeleteAccount }) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center space-x-2 text-light/80 hover:text-primary transition-colors">
        <FiUser className="h-6 w-6" />
        <span className="hidden md:inline">Profile</span>
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-48 bg-dark/90 backdrop-blur-lg rounded-lg shadow-xl border border-primary/20">
        <div className="p-2 space-y-2">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onLogout}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  active ? 'bg-primary/20' : ''
                }`}>
                <FiLogOut className="inline mr-2" /> Log Out
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onDeleteAccount}
                className={`w-full text-left px-4 py-2 text-red-600 rounded-md ${
                  active ? 'bg-primary/20' : ''
                }`}>
                <FiLogOut className="inline mr-2" /> Delete Your Account
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default ProfileMenu;
