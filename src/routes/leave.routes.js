import express from 'express';
import { applyForLeave, getMyLeaves, getLeaveSummary, getLeaves, updateLeave, cancelLeave } from '../controllers/leave.controllers.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { adminAuth } from '../middlewares/admin.middleware.js';

const router = express.Router();

// Apply for leave
router.post('/apply', authenticate, applyForLeave);

// Get my leaves
router.get('/my', authenticate, getMyLeaves);

// Get leave summary
router.get('/summary', authenticate, getLeaveSummary);

// Cancel leave (employee)
router.delete('/:id', authenticate, cancelLeave);

// Get all leaves (admin)
router.get('/', adminAuth, getLeaves);

// Update leave status (admin)
router.patch('/:id/status', adminAuth, updateLeave);

export default router;