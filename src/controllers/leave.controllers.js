import Leave from '../models/Leave.js';
import User from '../models/User.js';
import { applyLeave, getUserLeaves, getAllLeaves, updateLeaveStatus, cancelLeave as cancelLeaveService, calculateLeaveSummary } from '../services/leave.service.js';

// Apply for leave
export const applyForLeave = async (req, res) => {
  try {
    const leave = await applyLeave(req.user._id, req.body);
    res.status(201).json({ message: 'Leave applied successfully', leave });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user's leaves
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await getUserLeaves(req.user._id);
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all leaves (admin)
export const getLeaves = async (req, res) => {
  try {
    const leaves = await getAllLeaves();
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update leave status (admin)
export const updateLeave = async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await updateLeaveStatus(req.params.id, status, req.user._id);
    res.json({ message: 'Leave status updated', leave });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get leave summary
export const getLeaveSummary = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const summary = await calculateLeaveSummary
      (req.user._id);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Cancel leave (employee)
export const cancelLeave = async (req, res) => {
  try {
    const result = await cancelLeaveService(req.params.id, req.user._id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
