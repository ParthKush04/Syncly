import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'reportedUser is required']
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'reportedBy is required']
    },
    reason: {
      type: String,
      required: [true, 'reason is required'],
      trim: true,
      minlength: [5, 'reason must be at least 5 characters long'],
      maxlength: [500, 'reason cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: [500, 'adminNotes cannot exceed 500 characters'],
      default: ''
    }
  },
  {
    timestamps: true
  }
);

reportSchema.index({ reportedUser: 1, status: 1, createdAt: -1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;