import Leave from '../models/Leave.js';
import User from '../models/User.js';

// Check for overlapping leaves
const isOverlapping = async (userId, startDate, endDate) => {
  const overlap = await Leave.findOne({
    userId,
    status: { $in: ['PENDING', 'APPROVED'] },
    $or: [
      { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
    ]
  });
  return !!overlap;
};

// Apply for leave
export const applyLeave = async (userId, leaveData) => {
  const { leaveType, startDate, endDate, reason } = leaveData;

  // Normalize leaveType to uppercase
  const normalizedLeaveType = leaveType.toUpperCase();

  // Calculate total days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

  // Check for overlapping leaves
  if (await isOverlapping(userId, startDate, endDate)) {
    throw new Error('Leave overlaps with existing leave');
  }

  // Check leave balance for paid leave
  if (normalizedLeaveType === 'PAID') {
    const user = await User.findById(userId);
    if (user.leaveBalance < totalDays) throw new Error('Insufficient leave balance');
  }

  // Create leave request
  const leave = await Leave.create({
    userId,
    leaveType: normalizedLeaveType,
    startDate,
    endDate,
    totalDays,
    reason,
  });

  return leave;
};

// Get user's leaves
export const getUserLeaves = async (userId) => {
  return await Leave.find({ userId }).sort({ createdAt: -1 });
};

// Get all leaves (admin)
export const getAllLeaves = async () => {
  return await Leave.find().populate('userId', 'fullName email').sort({ createdAt: -1 });
};

// Update leave status (admin)
export const updateLeaveStatus = async (leaveId, status) => {
  if (!['APPROVED', 'REJECTED'].includes(status)) {
    throw new Error('Invalid status');
  }

  const leave = await Leave.findById(leaveId);
  if (!leave) throw new Error('Leave not found');

  if (leave.status !== 'PENDING') {
    throw new Error('Leave already processed');
  }

  if (status === 'APPROVED') {
    const user = await User.findById(leave.userId);
    if (user.leaveBalance < leave.totalDays) {
      throw new Error('Insufficient leave balance');
    }
    user.leaveBalance -= leave.totalDays;
    await user.save();
  }

  leave.status = status;
  await leave.save();
  return leave;
};


// leave summary
export const calculateLeaveSummary = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const approvedLeaves = await Leave.find({
    userId,
    status: "APPROVED"
  });

  const usedDays = approvedLeaves.reduce(
    (sum, leave) => sum + leave.totalDays,
    0
  );

  return {
    total: user.totalLeaves,
    used: usedDays,
    remaining: user.totalLeaves - usedDays
  };
};


// Cancel leave (employee)
export const cancelLeave = async (leaveId, userId) => {
  const leave = await Leave.findOne({ _id: leaveId, userId });
  if (!leave) throw new Error('Leave not found');

  if (leave.status !== 'PENDING') {
    throw new Error('Cannot cancel processed leave');
  }

  await Leave.findByIdAndDelete(leaveId);
  return { message: 'Leave cancelled successfully' };
};
