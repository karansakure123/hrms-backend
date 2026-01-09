// Middleware to check if user is admin
import { authenticate } from './auth.middleware.js';

export const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

export const adminAuth = [authenticate, authorizeAdmin];
