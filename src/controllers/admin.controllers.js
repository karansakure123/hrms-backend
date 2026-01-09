import * as adminService from '../services/admin.service.js';

// ---- LEAVE ----
export const getLeaves = async (req, res) => {
  const leaves = await adminService.getAllLeaves();
  res.json(leaves);
};

export const approveRejectLeave = async (req, res) => {
  const { status } = req.body;
  const leave = await adminService.updateLeaveStatus(req.params.id, status);
  res.json({ message: `Leave ${status.toLowerCase()}`, leave });
};

// ---- ATTENDANCE ----
export const getAttendance = async (req, res) => {
  const filters = req.query; // employeeId, startDate, endDate
  const records = await adminService.getAllAttendance(filters);
  res.json(records);
};

// ---- EMPLOYEES ----
export const getEmployees = async (req, res) => {
  const employees = await adminService.getAllEmployees();
  res.json(employees);
};
