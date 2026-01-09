import { markAttendance, checkIn, checkOut, getMyAttendance, getAllAttendance } from '../services/attendance.service.js';

// Check in
export const checkInController = async (req, res) => {
  try {
    const attendance = await checkIn(req.user._id);
    res.status(200).json({ message: 'Checked in successfully', attendance });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Check out
export const checkOutController = async (req, res) => {
  try {
    const attendance = await checkOut(req.user._id);
    res.status(200).json({ message: 'Checked out successfully', attendance });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mark attendance
export const markAttendanceToday = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['PRESENT', 'ABSENT'].includes(status.toUpperCase())) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const attendance = await markAttendance(req.user._id, status);
    res.status(201).json({ message: 'Attendance marked', attendance });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get my attendance
export const getMyAttendanceHistory = async (req, res) => {
  try {
    const attendance = await getMyAttendance(req.user._id);
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all attendance (admin)
export const getAttendance = async (req, res) => {
  try {
    const filters = {};
    if (req.query.employeeId) filters.employeeId = req.query.employeeId;
    if (req.query.start && req.query.end) {
      filters.startDate = req.query.start;
      filters.endDate = req.query.end;
    }
    const attendance = await getAllAttendance(filters);
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};