import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  const coverImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  return (
    <div className="property-card">
      <div className="property-image-container">
        <img src={coverImage} alt={property.title} className="property-img" />
        <div className="property-status badge">{property.propertyType}</div>
        <div className="property-price">
          ${property.price.toLocaleString()}
        </div>
      </div>
      
      <div className="property-content">
        <div className="property-type">{property.propertyType}</div>
        <h3 className="property-title">
          <Link to={`/properties/${property._id}`}>{property.title}</Link>
        </h3>
        
        <div className="property-location">
          <FaMapMarkerAlt className="icon" />
          {property.location}
        </div>
        
        <div className="property-features">
          <div className="feature">
            <FaBed className="icon" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="feature">
            <FaBath className="icon" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="feature">
            <FaRulerCombined className="icon" />
            <span>{property.area} sqft</span>
          </div>
        </div>
        
        <div className="property-footer">
          <Link to={`/properties/${property._id}`} className="btn btn-primary w-full">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
