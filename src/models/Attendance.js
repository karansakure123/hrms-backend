import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Normalized date (start of day)
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
      enum: ['PRESENT', 'ABSENT'],
      default: 'PRESENT',
    },

    workingMinutes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/**
 * Ensure:
 * One attendance per employee per day
 */
attendanceSchema.index(
  { employee: 1, date: 1 },
  { unique: true }
);

/**
 * Auto-calculate working hours on check-out
 */
attendanceSchema.pre('save', function () {
  if (this.checkIn && this.checkOut) {
    const diffMs = this.checkOut - this.checkIn;
    this.workingMinutes = Math.floor(diffMs / (1000 * 60));
  }
 });

export default mongoose.model('Attendance', attendanceSchema);
