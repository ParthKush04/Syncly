import { submitConversationRating } from '../services/ratingService.js';

export async function createConversationRating(req, res, next) {
  try {
    const { sessionId, ratedUserId, conversationRating, helpfulness, professionalismScore, comment } = req.body || {};

    if (!sessionId || !ratedUserId) {
      return res.status(400).json({ message: 'sessionId and ratedUserId are required' });
    }

    const result = await submitConversationRating({
      sessionId,
      ratedById: req.user._id,
      ratedUserId,
      conversationRating,
      helpfulness,
      professionalismScore,
      comment
    });

    return res.status(201).json({
      message: 'Conversation rating submitted successfully',
      rating: result.rating,
      ratedUser: {
        id: result.ratedUser._id,
        fullName: result.ratedUser.fullName,
        reputationScore: result.ratedUser.reputationScore
      },
      ratingScore: result.ratingScore
    });
  } catch (error) {
    return next(error);
  }
}