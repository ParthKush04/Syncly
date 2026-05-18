import mongoose from 'mongoose';

const matchHistorySchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user1 is required']
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user2 is required']
    },
    sessionType: {
      type: String,
      required: [true, 'sessionType is required'],
      trim: true,
      enum: ['video', 'audio', 'chat']
    },
    duration: {
      type: Number,
      required: [true, 'duration is required'],
      min: [0, 'duration cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

matchHistorySchema.index({ user1: 1, user2: 1, createdAt: -1 });

const MatchHistory = mongoose.model('MatchHistory', matchHistorySchema);

export default MatchHistory;