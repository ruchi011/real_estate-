import { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import './Contact.css';

const Contact = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');

  const [formData, setFormData] = useState({
    userName: user ? user.name : '',
    userEmail: user ? user.email : '',
    phone: '',
    message: '',
    propertyId: propertyId || ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        userName: user.name,
        userEmail: user.email
      }));
    }
  }, [user]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/contact', formData);
      
      setStatus({ 
        type: 'success', 
        message: 'Your message has been sent successfully. An agent will contact you shortly.' 
      });
      
      setFormData({
        userName: user ? user.name : '',
        userEmail: user ? user.email : '',
        phone: '',
        message: '',
        propertyId: propertyId || ''
      });
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.error || 'Something went wrong. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container contact-hero-content animate-fade-in">
          <h1>Get in Touch</h1>
          <p>We're here to help you find your perfect home.</p>
        </div>
      </div>

      <div className="container contact-content">
        <div className="contact-grid">
          {/* Contact Information */}
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p className="mb-8 text-light">
              Have questions about a property or need help with selling your home? 
              Our team of expert agents is ready to assist you.
            </p>

            <div className="info-item">
              <div className="icon-wrapper">
                <FaMapMarkerAlt />
              </div>
              <div className="info-text">
                <h3>Our Office</h3>
                <p>123 Luxury Lane, Suite 100<br/>Beverly Hills, CA 90210</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-wrapper">
                <FaPhone />
              </div>
              <div className="info-text">
                <h3>Phone Number</h3>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-wrapper">
                <FaEnvelope />
              </div>
              <div className="info-text">
                <h3>Email Address</h3>
                <p>hello@luxeestates.com</p>
              </div>
            </div>
            
            <div className="working-hours mt-8 p-6 glass-effect">
              <h3>Office Hours</h3>
              <ul className="hours-list">
                <li><span>Monday - Friday:</span> <span>9:00 AM - 6:00 PM</span></li>
                <li><span>Saturday:</span> <span>10:00 AM - 4:00 PM</span></li>
                <li><span>Sunday:</span> <span>Closed</span></li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-container glass-effect shadow-xl">
            <h2>Send a Message</h2>
            
            {status.message && (
              <div className={`form-status ${status.type}`}>
                {status.message}
              </div>
            )}

            <form onSubmit={onSubmit} className="contact-form">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={onChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={onChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group flex-1">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                    className="form-input"
                  />
                </div>
              </div>

              {propertyId && (
                <div className="form-group">
                  <label className="form-label">Property ID</label>
                  <input
                    type="text"
                    name="propertyId"
                    value={formData.propertyId}
                    className="form-input"
                    readOnly
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={onChange}
                  className="form-input textarea"
                  rows="5"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-full mt-4"
                disabled={submitting}
              >
                {submitting ? 'Sending...' : <><FaPaperPlane style={{marginRight: '8px'}} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
