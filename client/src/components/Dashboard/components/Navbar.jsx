import { FiMenu, FiX } from 'react-icons/fi';
import ProfileMenu from './ProfileMenu';

const Navbar = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  onLogout,
  onDeleteAccount,
}) => {
  return (
    <nav className="bg-dark/90 backdrop-blur-md fixed w-full z-50 border-b border-primary/20">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            className="md:hidden text-light/80 hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>

          <a
            href="/"
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            OptiLife AI
          </a>

          <span className="hidden md:block text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard
          </span>

          <ProfileMenu onLogout={onLogout} onDeleteAccount={onDeleteAccount} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
