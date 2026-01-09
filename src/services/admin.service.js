import Leave from '../models/Leave.js';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

// ---- LEAVE ----
export const getAllLeaves = async () => {
  return await Leave.find()
    .populate('userId', 'fullName email')
    .sort({ createdAt: -1 });
};

export const updateLeaveStatus = async (leaveId, status) => {
  const leave = await Leave.findById(leaveId).populate('userId');
  if (!leave) throw new Error('Leave not found');
  if (!['APPROVED','REJECTED'].includes(status)) throw new Error('Invalid status');
  if (leave.status !== 'PENDING') throw new Error('Leave already processed');

  if (status === 'APPROVED') {
    const employee = leave.userId;
    if (employee.leaveBalance < leave.totalDays) throw new Error('Insufficient balance');
    employee.leaveBalance -= leave.totalDays;
    await employee.save();
  }

  leave.status = status;
  await leave.save();
  return leave;
};

// ---- ATTENDANCE ----
export const getAllAttendance = async (filters = {}) => {
  const query = {};
  if (filters.employeeId) query.employee = filters.employeeId;
  if (filters.startDate && filters.endDate)
    query.date = { $gte: new Date(filters.startDate), $lte: new Date(filters.endDate) };

  return await Attendance.find(query)
    .populate('employee', 'fullName email')
    .sort({ date: -1 });
};

// ---- EMPLOYEES ----
export const getAllEmployees = async () => {
  return await User.find({ role: 'EMPLOYEE' }).select('-password');
};
