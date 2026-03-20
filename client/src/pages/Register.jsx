import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserShield } from 'react-icons/fa';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in glass-effect">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join LuxeEstates to save your favorite properties</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                className="form-input"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                className="form-input"
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  className="form-input"
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  placeholder="Password"
                  required
                  minLength="6"
                />
              </div>
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Confirm</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  className="form-input"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={onChange}
                  placeholder="Confirm"
                  required
                  minLength="6"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Account Type (Demo)</label>
            <div className="input-with-icon select-wrapper">
              <FaUserShield className="input-icon pointer-events-none" />
              <select 
                name="role" 
                value={formData.role} 
                onChange={onChange}
                className="form-input pl-10"
              >
                <option value="user">Regular User</option>
                <option value="admin">Admin (For Demo Purposes)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-4" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
