import express from 'express';
import { login, getMe, register } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login   — Admin login
router.post('/login', login);

// GET  /api/auth/me       — Get current user (protected)
router.get('/me', verifyToken, getMe);

// POST /api/auth/register — Register (for initial admin setup)
router.post('/register', register);

export default router;
