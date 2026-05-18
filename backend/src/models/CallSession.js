import mongoose from 'mongoose';

const callSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: [true, 'sessionId is required'],
      unique: true,
      index: true,
      trim: true
    },
    hostUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'hostUser is required']
    },
    participantUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    sessionType: {
      type: String,
      required: [true, 'sessionType is required'],
      enum: ['audio', 'video'],
      default: 'video'
    },
    status: {
      type: String,
      enum: ['active', 'ended'],
      default: 'active'
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    endedAt: {
      type: Date,
      default: null
    },
    duration: {
      type: Number,
      default: 0,
      min: [0, 'duration cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

const CallSession = mongoose.model('CallSession', callSessionSchema);

export default CallSession;