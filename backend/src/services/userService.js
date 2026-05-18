import User from '../models/User.js';
import MatchHistory from '../models/MatchHistory.js';

function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
}

export async function getUserProfile(userId) {
  return User.findById(userId).select('-__v');
}

export async function updateUserProfile(userId, profileData) {
  const user = await User.findById(userId);

  if (!user) {
    return null;
  }

  const allowedUpdates = {
    bio: typeof profileData.bio === 'string' ? profileData.bio.trim() : undefined,
    profession: typeof profileData.profession === 'string' ? profileData.profession.trim() : undefined,
    company: typeof profileData.company === 'string' ? profileData.company.trim() : undefined,
    interests: normalizeStringArray(profileData.interests),
    networkingGoals: normalizeStringArray(profileData.networkingGoals)
  };

  for (const [field, value] of Object.entries(allowedUpdates)) {
    if (value !== undefined) {
      user[field] = value;
    }
  }

  await user.save();
  return user;
}

function calculateProfileStrength(user) {
  const fields = [
    user.fullName,
    user.email,
    user.bio,
    user.profession,
    user.company,
    user.profileImage,
    user.linkedinUrl,
    user.interests?.length ? user.interests : null,
    user.networkingGoals?.length ? user.networkingGoals : null,
    user.experienceLevel
  ];

  const completedFields = fields.filter(Boolean).length;
  return Math.min(100, Math.round((completedFields / fields.length) * 100));
}

function mapMatchPartner(match, userId) {
  const user1Id = match.user1?._id?.toString?.() || match.user1?.toString?.();
  const user2Id = match.user2?._id?.toString?.() || match.user2?.toString?.();
  const partner = user1Id === userId ? match.user2 : match.user1;

  if (!partner) {
    return null;
  }

  return {
    matchId: match._id.toString(),
    id: partner._id?.toString?.() || partner.toString(),
    fullName: partner.fullName || 'Unknown user',
    profession: partner.profession || '',
    company: partner.company || '',
    photoUrl: partner.profileImage || '',
    matchedAt: match.createdAt,
    sessionType: match.sessionType,
    duration: match.duration
  };
}

export async function getDashboardData(userId) {
  const user = await User.findById(userId).select('-__v');

  if (!user) {
    return null;
  }

  const recentMatches = await MatchHistory.find({
    $or: [{ user1: userId }, { user2: userId }]
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate([
      { path: 'user1', select: 'fullName profileImage profession company' },
      { path: 'user2', select: 'fullName profileImage profession company' }
    ]);

  const mappedMatches = recentMatches
    .map((match) => mapMatchPartner(match, userId.toString()))
    .filter(Boolean);

  const profileStrength = calculateProfileStrength(user);

  return {
    user,
    summary: {
      profileStrength,
      activeMatches: mappedMatches.length,
      networkScore: user.reputationScore || 0,
      interestsCount: user.interests?.length || 0,
      goalsCount: user.networkingGoals?.length || 0
    },
    recentMatches: mappedMatches
  };
}