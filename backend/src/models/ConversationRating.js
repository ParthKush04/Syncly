import mongoose from 'mongoose';

const conversationRatingSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: [true, 'sessionId is required'],
      index: true,
      trim: true
    },
    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'ratedBy is required']
    },
    ratedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'ratedUser is required']
    },
    conversationRating: {
      type: Number,
      required: [true, 'conversationRating is required'],
      min: [1, 'conversationRating must be at least 1'],
      max: [5, 'conversationRating cannot exceed 5']
    },
    helpfulness: {
      type: Boolean,
      required: [true, 'helpfulness is required']
    },
    professionalismScore: {
      type: Number,
      required: [true, 'professionalismScore is required'],
      min: [1, 'professionalismScore must be at least 1'],
      max: [5, 'professionalismScore cannot exceed 5']
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'comment cannot exceed 500 characters'],
      default: ''
    },
    reputationDelta: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

conversationRatingSchema.index({ sessionId: 1, ratedBy: 1 }, { unique: true });

const ConversationRating = mongoose.model('ConversationRating', conversationRatingSchema);

export default ConversationRating;