import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Verify password
export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register user
export const registerUser = async (userData) => {
  const { fullName, email, password, dateOfJoining } = userData;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('User already exists');

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    dateOfJoining,
  });

  return { user };
};

// Login user
export const loginUser = async (email, password) => {
  // Find user
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  // Verify password
  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  // Generate token
  const token = generateToken(user._id);

  return { user, token };
};