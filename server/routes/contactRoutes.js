import express from 'express';
import { submitContact, getContacts } from '../controllers/contactController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public — anyone can submit a contact message
router.route('/')
  .post(submitContact)
  .get(verifyToken, verifyAdmin, getContacts);  // Admin only

export default router;
