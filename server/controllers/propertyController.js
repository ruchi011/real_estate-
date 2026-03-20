import Property from '../models/Property.js';
import fs from 'fs';
import path from 'path';

// @desc    Get all properties with advanced filtering, sorting & pagination
// @route   GET /api/properties
// @query   location, propertyType, minPrice, maxPrice, minBedrooms, maxBedrooms,
//          minBathrooms, maxBathrooms, sort, page, limit
// @access  Public
export const getProperties = async (req, res) => {
  try {
    const query = {};

    // ─── Location filter (case-insensitive partial match) ───
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }

    // ─── Property type filter ───
    if (req.query.propertyType) {
      query.propertyType = req.query.propertyType.toLowerCase();
    }

    // ─── Price range filter ───
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // ─── Bedrooms filter ───
    if (req.query.minBedrooms || req.query.maxBedrooms) {
      query.bedrooms = {};
      if (req.query.minBedrooms) query.bedrooms.$gte = Number(req.query.minBedrooms);
      if (req.query.maxBedrooms) query.bedrooms.$lte = Number(req.query.maxBedrooms);
    }

    // ─── Bathrooms filter ───
    if (req.query.minBathrooms || req.query.maxBathrooms) {
      query.bathrooms = {};
      if (req.query.minBathrooms) query.bathrooms.$gte = Number(req.query.minBathrooms);
      if (req.query.maxBathrooms) query.bathrooms.$lte = Number(req.query.maxBathrooms);
    }

    // ─── Sorting ───
    // e.g. sort=price (asc), sort=-price (desc), sort=-createdAt
    let sortBy = '-createdAt'; // default: newest first
    if (req.query.sort) {
      sortBy = req.query.sort;
    }

    // ─── Pagination ───
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;

    // Execute query
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('createdBy', 'name email')
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: properties
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error: ' + err.message });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('createdBy', 'name email');

    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: 'Property not found — invalid ID' });
    }
    res.status(500).json({ success: false, error: 'Server error: ' + err.message });
  }
};

// @desc    Create new property (with optional image uploads)
// @route   POST /api/properties
// @access  Private — Admin only
export const createProperty = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;

    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const { title, description, price, location, propertyType, bedrooms, bathrooms, area, contactNumber } = req.body;

    if (!title || !description || !price || !location || !propertyType || bedrooms === undefined || bathrooms === undefined || !area || !contactNumber) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: title, description, price, location, propertyType, bedrooms, bathrooms, area, contactNumber'
      });
    }

    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      data: property
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    res.status(500).json({ success: false, error: 'Server error: ' + err.message });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private — Admin only
export const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      req.body.images = [...(property.images || []), ...newImages];
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: 'Property not found — invalid ID' });
    }
    res.status(500).json({ success: false, error: 'Server error: ' + err.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private — Admin only
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    if (property.images && property.images.length > 0) {
      property.images.forEach(imagePath => {
        const fullPath = path.join(process.cwd(), imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Property deleted successfully'
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: 'Property not found — invalid ID' });
    }
    res.status(500).json({ success: false, error: 'Server error: ' + err.message });
  }
};
