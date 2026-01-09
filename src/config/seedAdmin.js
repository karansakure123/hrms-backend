import User from '../models/User.js';
import { hashPassword } from '../services/auth.service.js';
import connectDB from './db.js';

// Seed admin user
const seedAdmin = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Check if admin exists
    const adminExists = await User.findOne({ role: 'ADMIN' });

    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await hashPassword('admin123'); // Default password

    const admin = await User.create({
      fullName: 'Admin Karan',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'ADMIN',
      dateOfJoining: new Date(),
    });

    console.log('Admin user created:', admin.email);
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    process.exit();
  }
};

// Run if called directly
seedAdmin();

export default seedAdmin;