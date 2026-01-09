import { registerUser, loginUser } from '../services/auth.service.js';

// Register controller
export const register = async (req, res) => {
  try {
    const { fullName, email, password, dateOfJoining } = req.body;

    // Validate input
    if (!fullName || !email || !password || !dateOfJoining) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const result = await registerUser({ fullName, email, password, dateOfJoining });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.user._id,
        fullName: result.user.fullName,
        email: result.user.email,
        role: result.user.role,
        dateOfJoining: result.user.dateOfJoining,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await loginUser(email, password);

    res.json({
      message: 'Login successful',
      user: {
        id: result.user._id,
        fullName: result.user.fullName,
        email: result.user.email,
        role: result.user.role,
      },
      token: result.token,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Get current user
export const getMe = (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
      dateOfJoining: req.user.dateOfJoining,
      leaveBalance: req.user.leaveBalance,
    },
  });
};