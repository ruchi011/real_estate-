import { FaHeart } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <h3>LuxeEstates</h3>
          <p>Finding your dream home made easy. The premium real estate platform for buyers and sellers.</p>
        </div>
        
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/properties">Properties</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>123 Luxury Lane, Beverly Hills, CA 90210</p>
          <p>Email: hello@luxeestates.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} LuxeEstates. Crafted with <FaHeart className="heart-icon" /> by Real Estate Tech.</p>
      </div>
    </footer>
  );
};

export default Footer;
