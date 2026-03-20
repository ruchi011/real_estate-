import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaFilter, FaMapMarkerAlt, FaTimes, FaSortAmountDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import './PropertyListings.css';

const PropertyListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const [filters, setFilters] = useState({
    location: queryParams.get('location') || '',
    propertyType: queryParams.get('type') || '',
    minPrice: queryParams.get('minPrice') || '',
    maxPrice: queryParams.get('maxPrice') || '',
    minBedrooms: '',
    minBathrooms: '',
    sort: '-createdAt',
    page: 1
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchProperties = async (params = filters) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();

      if (params.location) query.set('location', params.location);
      if (params.propertyType) query.set('propertyType', params.propertyType);
      if (params.minPrice) query.set('minPrice', params.minPrice);
      if (params.maxPrice) query.set('maxPrice', params.maxPrice);
      if (params.minBedrooms) query.set('minBedrooms', params.minBedrooms);
      if (params.minBathrooms) query.set('minBathrooms', params.minBathrooms);
      if (params.sort) query.set('sort', params.sort);
      query.set('page', params.page || 1);
      query.set('limit', 9);

      const res = await api.get(`/properties?${query.toString()}`);

      setProperties(res.data.data);
      setPagination({
        page: res.data.page,
        pages: res.data.pages,
        total: res.data.total
      });
    } catch (err) {
      console.error('Error fetching properties', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(filters);
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    const newFilters = { ...filters, page: 1 };
    setFilters(newFilters);
    fetchProperties(newFilters);
    setShowMobileFilters(false);
  };

  const resetFilters = () => {
    const empty = {
      location: '', propertyType: '', minPrice: '', maxPrice: '',
      minBedrooms: '', minBathrooms: '', sort: '-createdAt', page: 1
    };
    setFilters(empty);
    fetchProperties(empty);
  };

  const handleSortChange = (e) => {
    const newFilters = { ...filters, sort: e.target.value, page: 1 };
    setFilters(newFilters);
    fetchProperties(newFilters);
  };

  const goToPage = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchProperties(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount = [filters.location, filters.propertyType, filters.minPrice, filters.maxPrice, filters.minBedrooms, filters.minBathrooms].filter(v => v !== '').length;

  return (
    <div className="listings-page">
      {/* Page Header */}
      <div className="listings-hero">
        <div className="container">
          <h1>Explore Properties</h1>
          <p>Discover your perfect home from our curated collection of premium listings.</p>
        </div>
      </div>

      <div className="container listings-container">
        {/* Mobile Filter Toggle */}
        <button className="mobile-filter-btn btn btn-secondary" onClick={() => setShowMobileFilters(!showMobileFilters)}>
          <FaFilter /> Filters {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
        </button>

        {/* ─── Sidebar Filters ─── */}
        <aside className={`filters-sidebar ${showMobileFilters ? 'show' : ''}`}>
          <div className="filters-card">
            <div className="filters-header">
              <h3><FaFilter /> Filters</h3>
              <div className="filter-actions">
                <button className="btn-link" onClick={resetFilters}>Reset All</button>
                <button className="mobile-close" onClick={() => setShowMobileFilters(false)}><FaTimes /></button>
              </div>
            </div>

            <form onSubmit={applyFilters} className="filters-form">
              {/* Location */}
              <div className="form-group">
                <label className="form-label"><FaMapMarkerAlt style={{marginRight: '6px'}} /> Location</label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="form-input"
                  placeholder="e.g. Delhi, Mumbai..."
                />
              </div>

              {/* Property Type */}
              <div className="form-group">
                <label className="form-label">Property Type</label>
                <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange} className="form-input">
                  <option value="">All Types</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="land">Land</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="form-group">
                <label className="form-label">Price Range</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min ($)"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="form-input"
                  />
                  <span className="price-separator">—</span>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max ($)"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div className="form-group">
                <label className="form-label">Bedrooms</label>
                <div className="bedroom-chips">
                  {['', '1', '2', '3', '4', '5'].map(val => (
                    <button
                      type="button"
                      key={val}
                      className={`chip ${filters.minBedrooms === val ? 'active' : ''}`}
                      onClick={() => setFilters({ ...filters, minBedrooms: val })}
                    >
                      {val === '' ? 'Any' : `${val}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div className="form-group">
                <label className="form-label">Bathrooms</label>
                <div className="bedroom-chips">
                  {['', '1', '2', '3', '4'].map(val => (
                    <button
                      type="button"
                      key={val}
                      className={`chip ${filters.minBathrooms === val ? 'active' : ''}`}
                      onClick={() => setFilters({ ...filters, minBathrooms: val })}
                    >
                      {val === '' ? 'Any' : `${val}+`}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full">Apply Filters</button>
            </form>
          </div>
        </aside>

        {/* ─── Results ─── */}
        <main className="listings-results">
          <div className="results-header">
            <h2>{pagination.total} {pagination.total === 1 ? 'Property' : 'Properties'} Found</h2>
            <div className="sort-control">
              <FaSortAmountDown className="sort-icon" />
              <select value={filters.sort} onChange={handleSortChange} className="sort-select">
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-bedrooms">Most Bedrooms</option>
                <option value="-area">Largest Area</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Finding properties for you...</p>
            </div>
          ) : properties.length > 0 ? (
            <>
              <div className="property-grid listings-grid">
                {properties.map(property => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>

              {/* ─── Pagination ─── */}
              {pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    disabled={pagination.page === 1}
                    onClick={() => goToPage(pagination.page - 1)}
                  >
                    <FaChevronLeft /> Prev
                  </button>

                  <div className="page-numbers">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(num => (
                      <button
                        key={num}
                        className={`page-num ${num === pagination.page ? 'active' : ''}`}
                        onClick={() => goToPage(num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <button
                    className="page-btn"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => goToPage(pagination.page + 1)}
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏠</div>
              <h3>No properties found</h3>
              <p>Try adjusting your filters or search criteria.</p>
              <button className="btn btn-secondary mt-4" onClick={resetFilters}>Clear Filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PropertyListings;
