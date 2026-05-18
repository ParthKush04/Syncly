import CallSession from '../models/CallSession.js';
import ConversationRating from '../models/ConversationRating.js';
import User from '../models/User.js';

function normalizeBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return ['true', 'yes', 'helpful', '1'].includes(value.trim().toLowerCase());
  }

  return Boolean(value);
}

function normalizeScore(value, fallback = 3) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return fallback;
  }

  return Math.min(5, Math.max(1, Math.round(numberValue)));
}

function calculateRatingScore({ conversationRating, helpfulness, professionalismScore }) {
  const ratingComponent = (conversationRating / 5) * 45;
  const professionalismComponent = (professionalismScore / 5) * 35;
  const helpfulnessComponent = helpfulness ? 20 : 0;

  return Math.round(ratingComponent + professionalismComponent + helpfulnessComponent);
}

function calculateReputationScore(currentScore, ratingScore) {
  const blendedScore = currentScore * 0.7 + ratingScore * 0.3;
  return Math.min(100, Math.max(0, Math.round(blendedScore)));
}

export async function submitConversationRating({
  sessionId,
  ratedById,
  ratedUserId,
  conversationRating,
  helpfulness,
  professionalismScore,
  comment = ''
}) {
  const normalizedConversationRating = normalizeScore(conversationRating);
  const normalizedHelpfulness = normalizeBoolean(helpfulness);
  const normalizedProfessionalismScore = normalizeScore(professionalismScore);

  const callSession = await CallSession.findOne({ sessionId });

  if (!callSession) {
    throw new Error('Call session not found');
  }

  if (callSession.status !== 'ended') {
    throw new Error('Call session must be ended before rating');
  }

  const hostId = String(callSession.hostUser);
  const participantId = String(callSession.participantUser || '');
  const currentRaterId = String(ratedById);
  const currentRatedUserId = String(ratedUserId);

  const isParticipantInSession = [hostId, participantId].includes(currentRaterId);
  const isRatedUserInSession = [hostId, participantId].includes(currentRatedUserId);

  if (!isParticipantInSession) {
    throw new Error('Only call participants can submit a rating');
  }

  if (!isRatedUserInSession || currentRaterId === currentRatedUserId) {
    throw new Error('Please rate the other participant in the session');
  }

  const ratedUser = await User.findById(currentRatedUserId);

  if (!ratedUser) {
    throw new Error('Rated user not found');
  }

  const ratingScore = calculateRatingScore({
    conversationRating: normalizedConversationRating,
    helpfulness: normalizedHelpfulness,
    professionalismScore: normalizedProfessionalismScore
  });

  const existingRating = await ConversationRating.findOne({ sessionId, ratedBy: ratedById });
  if (existingRating) {
    throw new Error('You have already rated this conversation');
  }

  const rating = await ConversationRating.create({
    sessionId,
    ratedBy: ratedById,
    ratedUser: currentRatedUserId,
    conversationRating: normalizedConversationRating,
    helpfulness: normalizedHelpfulness,
    professionalismScore: normalizedProfessionalismScore,
    comment: String(comment || '').trim(),
    reputationDelta: ratingScore
  });

  ratedUser.reputationScore = calculateReputationScore(ratedUser.reputationScore, ratingScore);
  await ratedUser.save();

  return {
    rating,
    ratedUser,
    ratingScore
  };
}