import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["EMPLOYEE", "ADMIN"], // 🔹 Only two options
    default: "EMPLOYEE"
  },
  dateOfJoining: {
    type: Date,
    required: true
  },
  totalLeaves: {
  type: Number,
  default: 20
},
  leaveBalance: {
    type: Number,
    default: 20
  }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
