import Attendance from '../models/Attendance.js';

// Check in
export const checkIn = async (employeeId) => {
  const now = new Date();
  const today = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  ));

  try {
    let attendance = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    if (attendance && attendance.checkIn) {
      throw new Error('Already checked in today');
    }

    if (!attendance) {
      attendance = await Attendance.create({
        employee: employeeId,
        date: today,
        checkIn: now,
        status: 'PRESENT',
      });
    } else {
      attendance.checkIn = now;
      await attendance.save();
    }

    return attendance;

  } catch (err) {
    // Handle Mongo duplicate key safely
    if (err.code === 11000) {
      throw new Error('Attendance already exists for today');
    }
    throw err;
  }
};


// Check out
export const checkOut = async (employeeId) => {
  // Create date for today (start of day in UTC)
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const attendance = await Attendance.findOne({ employee: employeeId, date: today });

  if (!attendance) {
    throw new Error('No attendance record found for today. Please check in first.');
  }

  if (!attendance.checkIn) {
    throw new Error('Cannot check out without checking in first');
  }

  if (attendance.checkOut) {
    throw new Error('Already checked out today');
  }

  attendance.checkOut = now;
  await attendance.save();

  return attendance;
};

// Mark attendance (legacy)
export const markAttendance = async (employeeId, status) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if already marked
  const existing = await Attendance.findOne({ employee: employeeId, date: today });
  if (existing) throw new Error('Attendance already marked for today');

  // Create attendance
  const attendance = await Attendance.create({
    employee: employeeId,
    date: today,
    status: status.toUpperCase(),
  });

  return attendance;
};

// Get my attendance
export const getMyAttendance = async (employeeId) => {
  return await Attendance.find({ employee: employeeId }).sort({ date: -1 });
};

// Get all attendance (admin)
export const getAllAttendance = async (filters = {}) => {
  const query = {};
  if (filters.employeeId) query.employee = filters.employeeId;
  if (filters.startDate && filters.endDate) {
    query.date = { $gte: new Date(filters.startDate), $lte: new Date(filters.endDate) };
  }
  return await Attendance.find(query).populate('employee', 'fullName email').sort({ date: -1 });
};