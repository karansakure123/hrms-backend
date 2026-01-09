import express from 'express';
import authRoutes from './auth.routes.js';
import leaveRoutes from './leave.routes.js';
import attendanceRoutes from './attendance.routes.js';
import adminRoutes from './admin.routes.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/leave', leaveRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/admin', adminRoutes);

export default router;