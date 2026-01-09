import express from 'express';
import { adminAuth } from '../middlewares/admin.middleware.js';
import {
  getLeaves,
  approveRejectLeave,
  getAttendance,
  getEmployees
} from '../controllers/admin.controllers.js';

const router = express.Router();

// Leave
router.get('/leaves', adminAuth, getLeaves);
router.patch('/leaves/:id/status', adminAuth, approveRejectLeave);

// Attendance
router.get('/attendance', adminAuth, getAttendance);

// Employees
router.get('/employees', adminAuth, getEmployees);

export default router;
