import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaArrowRight, FaHome, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import './Home.css';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    location: '',
    propertyType: '',
    maxPrice: ''
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/properties');
        setFeaturedProperties(res.data.data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching properties', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchParams.location) params.set('location', searchParams.location);
    if (searchParams.propertyType) params.set('type', searchParams.propertyType);
    if (searchParams.maxPrice) params.set('maxPrice', searchParams.maxPrice);
    window.location.href = `/properties?${params.toString()}`;
  };
  return (
    <div className="home">
      {/* ─── Hero Section ─── */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-particles">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div className="container hero-content animate-fade-in">
          <span className="hero-badge">✦ #1 Real Estate Platform</span>
          <h1>Discover Your <span className="gradient-text">Dream Home</span></h1>
          <p className="hero-subtitle">
            Explore luxury estates, modern apartments, and cozy family homes in the most sought-after locations worldwide.
          </p>
          
          {/* ─── Search Bar ─── */}
          <div className="hero-search glass-effect">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-field">
                <label><FaMapMarkerAlt className="label-icon" /> Location</label>
                <input 
                  type="text" 
                  placeholder="City, Neighborhood..."
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
                />
              </div>
              
              <div className="search-divider"></div>

              <div className="search-field">
                <label>Property Type</label>
                <select 
                  value={searchParams.propertyType}
                  onChange={(e) => setSearchParams({...searchParams, propertyType: e.target.value})}
                >
                  <option value="">Any Type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="land">Land</option>
                </select>
              </div>

              <div className="search-divider"></div>

              <div className="search-field">
                <label>Max Price</label>
                <select 
                  value={searchParams.maxPrice}
                  onChange={(e) => setSearchParams({...searchParams, maxPrice: e.target.value})}
                >
                  <option value="">No Limit</option>
                  <option value="100000">$100,000</option>
                  <option value="250000">$250,000</option>
                  <option value="500000">$500,000</option>
                  <option value="1000000">$1,000,000</option>
                  <option value="5000000">$5,000,000+</option>
                </select>
              </div>
              
              <button type="submit" className="btn btn-primary search-btn">
                <FaSearch /> Search
              </button>
            </form>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <strong>200+</strong>
              <span>Premium Properties</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <strong>50+</strong>
              <span>Locations</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <strong>1K+</strong>
              <span>Happy Clients</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Properties ─── */}
      <section className="featured-section container">
        <div className="section-header">
          <span className="section-tag">Our Portfolio</span>
          <h2>Featured Properties</h2>
          <p>Hand-picked premium listings curated just for you.</p>
        </div>
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading properties...</p>
          </div>
        ) : (
          <div className="property-grid">
            {featuredProperties.length > 0 ? (
              featuredProperties.map(property => (
                <PropertyCard key={property._id} property={property} />
              ))
            ) : (
              <p className="no-properties">No properties available yet. Check back soon!</p>
            )}
          </div>
        )}
        
        <div className="view-all-container">
          <Link to="/properties" className="btn btn-secondary view-all-btn">
            View All Properties <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="features-section">
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">Why Us</span>
            <h2>Why Choose LuxeEstates?</h2>
            <p>Industry-leading service backed by technology and trust.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FaHome />
              </div>
              <h3>Premium Listings</h3>
              <p>Only verified, high-quality properties that meet our strict quality standards.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper accent">
                <FaShieldAlt />
              </div>
              <h3>Secure & Transparent</h3>
              <p>Every transaction is protected with bank-level security and full transparency.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper green">
                <FaHeadset />
              </div>
              <h3>24/7 Expert Support</h3>
              <p>Our dedicated team of agents is available around the clock to assist you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Call to Action ─── */}
      <section className="cta-section">
        <div className="container cta-content">
          <div className="cta-text">
            <h2>Ready to Find Your Dream Home?</h2>
            <p>Join thousands of happy homeowners. Let us help you discover the perfect property that fits your lifestyle and budget.</p>
          </div>
          <div className="cta-actions">
            <Link to="/properties" className="btn btn-primary btn-lg">
              Browse Properties
            </Link>
            <Link to="/contact" className="btn btn-cta-outline btn-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
