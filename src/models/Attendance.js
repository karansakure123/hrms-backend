import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    checkIn: {
      type: Date,
      default: null,
    },

    checkOut: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["PRESENT", "ABSENT"],
      default: "PRESENT",
    },

    // Calculated in service (checkOut)
    workingMinutes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

//  One attendance per employee per day
attendanceSchema.index(
  { employee: 1, date: 1 },
  { unique: true }
);

export default mongoose.model("Attendance", attendanceSchema);
