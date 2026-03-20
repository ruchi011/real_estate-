import { useState, useEffect, useContext, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBuilding, FaEnvelope, FaHome, FaSignOutAlt, FaImage, FaTimes, FaEye, FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [properties, setProperties] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'house',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    contactNumber: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [propsRes, contactsRes] = await Promise.all([
        api.get('/properties'),
        api.get('/contact')
      ]);
      setProperties(propsRes.data.data);
      setContacts(contactsRes.data.data);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ─── Form Handlers ───
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);

    // Generate preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removePreview = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', propertyType: 'house',
      price: '', location: '', bedrooms: '', bathrooms: '',
      area: '', contactNumber: ''
    });
    setEditingId(null);
    setShowForm(false);
    setSelectedFiles([]);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
    setActiveSection('add');
  };

  const handleEdit = (property) => {
    setFormData({
      title: property.title,
      description: property.description,
      propertyType: property.propertyType,
      price: property.price,
      location: property.location,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      contactNumber: property.contactNumber || '',
    });
    setEditingId(property._id);
    setShowForm(true);
    setActiveSection('edit');
    setPreviewUrls(property.images || []);
    setSelectedFiles([]);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        await api.delete(`/properties/${id}`);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('propertyType', formData.propertyType);
    data.append('price', formData.price);
    data.append('location', formData.location);
    data.append('bedrooms', formData.bedrooms);
    data.append('bathrooms', formData.bathrooms);
    data.append('area', formData.area);
    data.append('contactNumber', formData.contactNumber);

    // Append selected image files
    selectedFiles.forEach(file => {
      data.append('images', file);
    });

    try {
      if (editingId) {
        await api.put(`/properties/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/properties', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      resetForm();
      setActiveSection('properties');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save property');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // ─── Sidebar Items ───
  const sidebarItems = [
    { id: 'overview', icon: <FaHome />, label: 'Overview' },
    { id: 'properties', icon: <FaBuilding />, label: 'All Properties' },
    { id: 'add', icon: <FaPlus />, label: 'Add Property' },
    { id: 'messages', icon: <FaEnvelope />, label: 'Contact Messages' },
  ];

  return (
    <div className="admin-layout">
      {/* ─── Sidebar ─── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <FaBuilding className="brand-icon" />
            <span className="brand-text">Admin Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveSection(item.id);
                if (item.id === 'add') { resetForm(); setShowForm(true); }
                else { setShowForm(false); }
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.id === 'messages' && contacts.length > 0 && (
                <span className="nav-badge">{contacts.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <strong>{user?.name}</strong>
              <span>Admin</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="admin-main">
        {/* Mobile Header */}
        <div className="admin-topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <h2 className="topbar-title">
            {activeSection === 'overview' && 'Dashboard Overview'}
            {activeSection === 'properties' && 'All Properties'}
            {activeSection === 'add' && (editingId ? 'Edit Property' : 'Add New Property')}
            {activeSection === 'edit' && 'Edit Property'}
            {activeSection === 'messages' && 'Contact Messages'}
          </h2>
        </div>

        <div className="admin-body">
          {loading ? (
            <div className="admin-loading"><div className="spinner"></div><p>Loading dashboard...</p></div>
          ) : (
            <>
              {/* ═══ OVERVIEW ═══ */}
              {activeSection === 'overview' && (
                <div className="overview-section">
                  <div className="stats-grid">
                    <div className="stat-card gradient-blue">
                      <div className="stat-content">
                        <h3>Total Properties</h3>
                        <p className="stat-number">{properties.length}</p>
                      </div>
                      <FaBuilding className="stat-bg-icon" />
                    </div>
                    <div className="stat-card gradient-green">
                      <div className="stat-content">
                        <h3>Contact Messages</h3>
                        <p className="stat-number">{contacts.length}</p>
                      </div>
                      <FaEnvelope className="stat-bg-icon" />
                    </div>
                    <div className="stat-card gradient-purple">
                      <div className="stat-content">
                        <h3>Houses</h3>
                        <p className="stat-number">{properties.filter(p => p.propertyType === 'house').length}</p>
                      </div>
                      <FaHome className="stat-bg-icon" />
                    </div>
                    <div className="stat-card gradient-orange">
                      <div className="stat-content">
                        <h3>Apartments</h3>
                        <p className="stat-number">{properties.filter(p => p.propertyType === 'apartment').length}</p>
                      </div>
                      <FaBuilding className="stat-bg-icon" />
                    </div>
                  </div>

                  {/* Recent Properties */}
                  <div className="admin-card">
                    <div className="card-header">
                      <h3>Recent Properties</h3>
                      <button className="btn btn-sm btn-secondary" onClick={() => setActiveSection('properties')}>View All</button>
                    </div>
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Location</th>
                            <th>Price</th>
                            <th>Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {properties.slice(0, 5).map(p => (
                            <tr key={p._id}>
                              <td><strong>{p.title}</strong></td>
                              <td>{p.location}</td>
                              <td>${p.price.toLocaleString()}</td>
                              <td><span className="type-badge">{p.propertyType}</span></td>
                            </tr>
                          ))}
                          {properties.length === 0 && <tr><td colSpan="4" className="empty-cell">No properties yet</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ ALL PROPERTIES ═══ */}
              {activeSection === 'properties' && (
                <div>
                  <div className="section-toolbar">
                    <p className="result-count">{properties.length} properties total</p>
                    <button className="btn btn-primary" onClick={handleAddNew}>
                      <FaPlus /> Add Property
                    </button>
                  </div>

                  <div className="admin-card">
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Location</th>
                            <th>Price</th>
                            <th>Type</th>
                            <th>Beds</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {properties.map(property => (
                            <tr key={property._id}>
                              <td>
                                <img 
                                  src={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100'} 
                                  alt="" 
                                  className="table-thumb" 
                                />
                              </td>
                              <td><strong>{property.title}</strong></td>
                              <td>{property.location}</td>
                              <td>${property.price.toLocaleString()}</td>
                              <td><span className="type-badge">{property.propertyType}</span></td>
                              <td>{property.bedrooms}</td>
                              <td>
                                <div className="action-btns">
                                  <button className="btn-icon view" onClick={() => window.open(`/properties/${property._id}`, '_blank')} title="View"><FaEye /></button>
                                  <button className="btn-icon edit" onClick={() => handleEdit(property)} title="Edit"><FaEdit /></button>
                                  <button className="btn-icon delete" onClick={() => handleDelete(property._id)} title="Delete"><FaTrash /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {properties.length === 0 && (
                            <tr><td colSpan="7" className="empty-cell">No properties found. <button className="btn-link" onClick={handleAddNew}>Add one now</button></td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ ADD / EDIT PROPERTY FORM ═══ */}
              {(activeSection === 'add' || activeSection === 'edit') && (
                <div className="admin-card form-card">
                  <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
                    {/* Basic Info */}
                    <div className="form-section-block">
                      <h3 className="form-section-title">Basic Information</h3>
                      <div className="form-grid">
                        <div className="form-group span-2">
                          <label className="form-label">Property Title *</label>
                          <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-input" placeholder="e.g. Modern Luxury Villa" required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Property Type *</label>
                          <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="form-input" required>
                            <option value="house">House</option>
                            <option value="apartment">Apartment</option>
                            <option value="villa">Villa</option>
                            <option value="land">Land</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Price ($) *</label>
                          <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="form-input" placeholder="500000" required />
                        </div>
                        <div className="form-group span-2">
                          <label className="form-label">Description *</label>
                          <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-input textarea" placeholder="Describe the property..." rows="4" required></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Location & Contact */}
                    <div className="form-section-block">
                      <h3 className="form-section-title">Location & Contact</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">Location *</label>
                          <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="form-input" placeholder="Beverly Hills, CA" required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Contact Number *</label>
                          <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="form-input" placeholder="+1 555-123-4567" required />
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="form-section-block">
                      <h3 className="form-section-title">Property Features</h3>
                      <div className="form-grid three-cols">
                        <div className="form-group">
                          <label className="form-label">Bedrooms *</label>
                          <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="form-input" placeholder="3" required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Bathrooms *</label>
                          <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="form-input" placeholder="2" required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Area (sqft) *</label>
                          <input type="number" name="area" value={formData.area} onChange={handleInputChange} className="form-input" placeholder="2500" required />
                        </div>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="form-section-block">
                      <h3 className="form-section-title"><FaImage style={{marginRight:'8px'}} /> Property Images</h3>
                      
                      <div 
                        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <FaUpload className="upload-icon" />
                        <p><strong>Click to upload images</strong></p>
                        <p className="upload-hint">JPG, PNG, GIF, WebP — Max 5MB each</p>
                        <input 
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          multiple
                          accept="image/*"
                          style={{ display: 'none' }}
                        />
                      </div>

                      {/* Image Previews */}
                      {previewUrls.length > 0 && (
                        <div className="preview-grid">
                          {previewUrls.map((url, index) => (
                            <div key={index} className="preview-item">
                              <img src={url} alt={`Preview ${index + 1}`} />
                              <button type="button" className="remove-preview" onClick={() => removePreview(index)}>
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                      <button type="button" className="btn btn-secondary" onClick={() => { resetForm(); setActiveSection('properties'); }}>Cancel</button>
                      <button type="submit" className="btn btn-primary">
                        {editingId ? 'Update Property' : 'Add Property'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ═══ CONTACT MESSAGES ═══ */}
              {activeSection === 'messages' && (
                <div>
                  <div className="section-toolbar">
                    <p className="result-count">{contacts.length} messages total</p>
                  </div>

                  {contacts.length > 0 ? (
                    <div className="messages-grid">
                      {contacts.map(contact => (
                        <div key={contact._id} className="message-card admin-card">
                          <div className="message-header">
                            <div className="message-avatar">
                              {contact.userName?.charAt(0).toUpperCase()}
                            </div>
                            <div className="message-meta">
                              <strong>{contact.userName}</strong>
                              <span className="message-date">{new Date(contact.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="message-body">
                            <p>{contact.message}</p>
                          </div>

                          <div className="message-details">
                            <div className="detail-row">
                              <span className="detail-label">Email:</span>
                              <span>{contact.userEmail}</span>
                            </div>
                            {contact.phone && (
                              <div className="detail-row">
                                <span className="detail-label">Phone:</span>
                                <span>{contact.phone}</span>
                              </div>
                            )}
                            {contact.propertyId && (
                              <div className="detail-row">
                                <span className="detail-label">Property:</span>
                                <a href={`/properties/${contact.propertyId._id || contact.propertyId}`} target="_blank" rel="noreferrer" className="msg-link">
                                  {contact.propertyId.title || 'View Property'}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="admin-card empty-cell" style={{padding:'3rem',textAlign:'center'}}>
                      <FaEnvelope style={{fontSize:'2rem', color:'#94a3b8', marginBottom:'1rem'}} />
                      <h3>No messages yet</h3>
                      <p style={{color:'var(--text-light)'}}>User inquiries will appear here.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
