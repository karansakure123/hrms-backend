import Attendance from '../models/Attendance.js';

// check in
export const checkIn = async (employeeId) => {
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let attendance = await Attendance.findOne({
    employee: employeeId,
    date: today,
  });

  if (attendance && attendance.checkIn) {
    throw new Error("Already checked in today");
  }

  if (!attendance) {
    attendance = await Attendance.create({
      employee: employeeId,
      date: today,
      checkIn: now,
      status: "PRESENT",
    });
  } else {
    attendance.checkIn = now;
    await attendance.save();
  }

  return attendance;
};





// Check out 
export const checkOut = async (employeeId) => {
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await Attendance.findOne({
    employee: employeeId,
    date: today,
  });

  if (!attendance || !attendance.checkIn) {
    throw new Error("Check-in required first");
  }

  if (attendance.checkOut) {
    throw new Error("Already checked out today");
  }

  attendance.checkOut = now;
  attendance.workingMinutes = Math.floor(
    (attendance.checkOut - attendance.checkIn) / 60000
  );

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