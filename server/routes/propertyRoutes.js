import express from 'express';
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
} from '../controllers/propertyController.js';

import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes — anyone can view properties
router.route('/')
  .get(getProperties)
  .post(verifyToken, verifyAdmin, upload.array('images', 10), createProperty);

router.route('/:id')
  .get(getProperty)
  .put(verifyToken, verifyAdmin, upload.array('images', 10), updateProperty)
  .delete(verifyToken, verifyAdmin, deleteProperty);

export default router;
