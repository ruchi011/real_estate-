import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaArrowLeft, FaPhone, FaChevronLeft, FaChevronRight, FaEnvelope } from 'react-icons/fa';
import api from '../utils/api';
import './PropertyDetails.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        setProperty(res.data.data);
      } catch (err) {
        setError('Property not found or server error');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="detail-loading container">
        <div className="spinner"></div>
        <h2>Loading property details...</h2>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="detail-loading container">
        <h2>{error || 'Property not found'}</h2>
        <Link to="/properties" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Listings</Link>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 
    ? property.images 
    : [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ];

  const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="property-details-page">
      <div className="container">
        {/* Back Navigation */}
        <div className="back-link">
          <Link to="/properties"><FaArrowLeft /> Back to Properties</Link>
        </div>

        {/* ─── Image Gallery ─── */}
        <div className="gallery-container">
          <div className="main-image">
            <img src={images[activeImage]} alt={property.title} />
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button className="gallery-nav prev" onClick={prevImage}><FaChevronLeft /></button>
                <button className="gallery-nav next" onClick={nextImage}><FaChevronRight /></button>
              </>
            )}
            
            {/* Image Counter */}
            <div className="image-counter">{activeImage + 1} / {images.length}</div>
            
            {/* Property Type Badge */}
            <div className="gallery-badge">{property.propertyType}</div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="thumbnail-strip">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={img} alt={`${property.title} view ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── Header ─── */}
        <div className="details-header">
          <div className="title-section">
            <h1>{property.title}</h1>
            <p className="location-text">
              <FaMapMarkerAlt /> {property.location}
            </p>
          </div>
          <div className="price-section">
            <div className="price">${property.price.toLocaleString()}</div>
          </div>
        </div>

        {/* ─── Content Layout ─── */}
        <div className="details-layout">
          <div className="main-content">
            {/* Key Features */}
            <div className="key-features detail-card">
              <div className="feature-item">
                <FaBed className="feature-icon" />
                <div>
                  <strong>{property.bedrooms}</strong>
                  <span>Bedrooms</span>
                </div>
              </div>
              <div className="feature-item">
                <FaBath className="feature-icon" />
                <div>
                  <strong>{property.bathrooms}</strong>
                  <span>Bathrooms</span>
                </div>
              </div>
              <div className="feature-item">
                <FaRulerCombined className="feature-icon" />
                <div>
                  <strong>{property.area.toLocaleString()}</strong>
                  <span>Sq Ft</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="description-section detail-card">
              <h2>About This Property</h2>
              <div className="desc-text">
                {property.description.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
            
            {/* Location Map Placeholder */}
            <div className="map-section detail-card">
              <h2>Location</h2>
              <div className="map-placeholder">
                <FaMapMarkerAlt className="map-icon" />
                <p><strong>{property.location}</strong></p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            {/* Contact Card */}
            <div className="contact-card detail-card">
              <h3>Contact Information</h3>

              {property.contactNumber && (
                <div className="contact-row">
                  <FaPhone className="contact-icon" />
                  <span>{property.contactNumber}</span>
                </div>
              )}

              {property.createdBy && (
                <div className="agent-info-block">
                  <div className="agent-avatar">
                    {property.createdBy.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong>{property.createdBy.name}</strong>
                    <p><FaEnvelope style={{marginRight:'6px', fontSize:'0.75rem'}} />{property.createdBy.email}</p>
                  </div>
                </div>
              )}

              <Link to={`/contact?propertyId=${property._id}`} className="btn btn-primary w-full" style={{ marginTop: '1.5rem' }}>
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
