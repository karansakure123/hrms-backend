import express from 'express';
import { markAttendanceToday, checkInController, checkOutController, getMyAttendanceHistory, getAttendance } from '../controllers/attendance.controllers.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { adminAuth } from '../middlewares/admin.middleware.js';

const router = express.Router();

// Check in
router.post('/checkin', authenticate, checkInController);

// Check out
router.post('/checkout', authenticate, checkOutController);

// Mark attendance (legacy)
router.post('/', authenticate, markAttendanceToday);

// Get my attendance
router.get('/', authenticate, getMyAttendanceHistory);

// Get all attendance (admin)
router.get('/all', adminAuth, getAttendance);

export default router;