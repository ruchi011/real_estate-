import ContactMessage from '../models/Contact.js';

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const contact = await ContactMessage.create(req.body);

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (Admin only)
export const getContacts = async (req, res) => {
  try {
    const contacts = await ContactMessage.find()
      .populate('propertyId', 'title location')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
