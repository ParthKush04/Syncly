const EXPERIENCE_LEVELS = ['student', 'entry', 'mid', 'senior', 'lead', 'executive'];

const EXPERIENCE_RANK = new Map(EXPERIENCE_LEVELS.map((level, index) => [level, index]));

const DEFAULT_SCORE = 0;

function normalizeStringList(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return [...new Set(values.map((value) => String(value).trim().toLowerCase()).filter(Boolean))];
}

function getExperienceRank(level) {
  return EXPERIENCE_RANK.get(String(level || '').toLowerCase()) ?? null;
}

function overlapCount(listA, listB) {
  const setB = new Set(listB);
  let matches = 0;

  for (const item of listA) {
    if (setB.has(item)) {
      matches += 1;
    }
  }

  return matches;
}

function normalizedOverlapScore(listA, listB) {
  const uniqueA = normalizeStringList(listA);
  const uniqueB = normalizeStringList(listB);

  if (uniqueA.length === 0 || uniqueB.length === 0) {
    return 0;
  }

  const overlap = overlapCount(uniqueA, uniqueB);
  const denominator = Math.max(uniqueA.length, uniqueB.length);

  return overlap / denominator;
}

function experienceCompatibilityScore(levelA, levelB) {
  const rankA = getExperienceRank(levelA);
  const rankB = getExperienceRank(levelB);

  if (rankA === null || rankB === null) {
    return levelA && levelB ? 0.4 : 0.6;
  }

  const gap = Math.abs(rankA - rankB);
  return Math.max(0, 1 - gap / (EXPERIENCE_LEVELS.length - 1));
}

export function normalizeMatchProfile(user) {
  return {
    id: user.id || user._id?.toString(),
    interests: normalizeStringList(user.interests),
    networkingGoals: normalizeStringList(user.networkingGoals),
    experienceLevel: String(user.experienceLevel || '').toLowerCase(),
    profession: String(user.profession || '').trim(),
    company: String(user.company || '').trim()
  };
}

export function calculateCompatibilityScore(userA, userB) {
  const profileA = normalizeMatchProfile(userA);
  const profileB = normalizeMatchProfile(userB);

  const interestScore = normalizedOverlapScore(profileA.interests, profileB.interests);
  const goalScore = normalizedOverlapScore(profileA.networkingGoals, profileB.networkingGoals);
  const experienceScore = experienceCompatibilityScore(profileA.experienceLevel, profileB.experienceLevel);

  const weightedScore = (interestScore * 0.4) + (goalScore * 0.4) + (experienceScore * 0.2);

  return Math.round(Math.max(0, Math.min(1, weightedScore)) * 100);
}

export function getCompatibilityBreakdown(userA, userB) {
  const profileA = normalizeMatchProfile(userA);
  const profileB = normalizeMatchProfile(userB);

  const sharedInterests = profileA.interests.filter((interest) => profileB.interests.includes(interest));
  const sharedGoals = profileA.networkingGoals.filter((goal) => profileB.networkingGoals.includes(goal));

  return {
    sharedInterests,
    sharedGoals,
    experienceGap: (() => {
      const rankA = getExperienceRank(profileA.experienceLevel);
      const rankB = getExperienceRank(profileB.experienceLevel);

      if (rankA === null || rankB === null) {
        return null;
      }

      return Math.abs(rankA - rankB);
    })(),
    score: calculateCompatibilityScore(profileA, profileB)
  };
}

export function isExperienceCompatible(userA, userB, maxGap = 2) {
  const rankA = getExperienceRank(userA?.experienceLevel);
  const rankB = getExperienceRank(userB?.experienceLevel);

  if (rankA === null || rankB === null) {
    return Boolean(userA?.experienceLevel) === Boolean(userB?.experienceLevel);
  }

  return Math.abs(rankA - rankB) <= maxGap;
}

export function rankCandidates(currentUser, candidates) {
  const normalizedCurrent = normalizeMatchProfile(currentUser);

  return candidates
    .map((candidate) => ({
      candidate,
      score: calculateCompatibilityScore(normalizedCurrent, candidate)
    }))
    .sort((left, right) => right.score - left.score);
}