import express from 'express';
import { register, login, getMe } from '../controllers/auth.controllers.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get current user
router.get('/me', authenticate, getMe);

export default router;