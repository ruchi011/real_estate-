import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaSignOutAlt, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled glass-effect' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
          <FaHome className="logo-icon" />
          <span>LuxeEstates</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-menu">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/properties" className={`nav-link ${isActive('/properties') ? 'active' : ''}`}>Properties</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
          
          {user ? (
            <div className="nav-userbox">
              {user.role === 'admin' && (
                <Link to="/admin" className={`nav-link admin-link ${isActive('/admin') ? 'active' : ''}`}>Admin</Link>
              )}
              <span className="user-greeting">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn-logout" onClick={onLogout} title="Logout">
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary nav-btn">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="mobile-menu glass-effect">
            <Link to="/" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/properties" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Properties</Link>
            <Link to="/contact" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="mobile-link admin-link" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
                )}
                <div className="mobile-user">
                  <span className="user-greeting"><FaUserCircle /> {user.name}</span>
                  <button className="btn btn-primary" onClick={onLogout}>Logout</button>
                </div>
              </>
            ) : (
              <div className="mobile-auth">
                <Link to="/login" className="btn btn-secondary w-full" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary w-full" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
