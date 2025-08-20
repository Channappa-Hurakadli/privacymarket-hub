import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Moon, Sun, Menu, X, Shield, User, LogOut } from 'lucide-react';
import { RootState } from '../store';
import { logout } from '../store/userSlice';
import { clearStoredUser } from '../utils/auth';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    dispatch(logout());
    clearStoredUser();
    navigate('/');
  };

  return (
    <nav className="bg-card border-b border-border shadow-[var(--shadow-soft)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MarketSafe AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
                {currentUser?.role === 'Buyer' && (
                  <Link to="/marketplace" className="text-foreground hover:text-primary transition-colors">
                    Marketplace
                  </Link>
                )}
                {currentUser?.role === 'Seller' && (
                  <Link to="/upload" className="text-foreground hover:text-primary transition-colors">
                    Upload
                  </Link>
                )}
                <Link to="/profile" className="text-foreground hover:text-primary transition-colors">
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-foreground hover:text-primary transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-hero text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* User Menu & Theme Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated && (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors">
                  <User className="w-5 h-5" />
                  <span className="hidden md:block">{currentUser?.name}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-[var(--shadow-medium)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full p-2 text-left hover:bg-muted rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="p-2 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="p-2 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {currentUser?.role === 'Buyer' && (
                    <Link
                      to="/marketplace"
                      className="p-2 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Marketplace
                    </Link>
                  )}
                  {currentUser?.role === 'Seller' && (
                    <Link
                      to="/upload"
                      className="p-2 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Upload
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="p-2 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="p-2 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-hero text-sm m-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;