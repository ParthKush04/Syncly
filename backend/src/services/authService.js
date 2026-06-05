import User from '../models/User.js';

function getLinkedInUrl(profile) {
  return (
    profile?.profileUrl ||
    profile?._json?.profileUrl ||
    profile?._json?.publicProfileUrl ||
    profile?._json?.publicProfileURL ||
    (profile?._json?.vanityName ? `https://www.linkedin.com/in/${profile._json.vanityName}` : undefined)
  );
}

function normalizeLinkedInUrl(value) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalizedValue = value.trim();
  return normalizedValue || undefined;
}

function getPrimaryEmail(profile) {
  return profile?.emails?.[0]?.value?.toLowerCase() || '';
}

function getFallbackEmail(provider, profile) {
  if (provider === 'linkedin' && profile?.id) {
    return `linkedin-${profile.id}@linkedin.local`;
  }

  return '';
}

function getDisplayName(profile, fallback = 'Social User') {
  return profile?.displayName || profile?.name?.formatted || fallback;
}

function getProfileImage(profile) {
  return profile?.photos?.[0]?.value || '';
}

export async function upsertOAuthUser(provider, profile) {
  const email = getPrimaryEmail(profile) || getFallbackEmail(provider, profile);
  const fullName = getDisplayName(profile, `${provider[0].toUpperCase()}${provider.slice(1)} User`);
  const profileImage = getProfileImage(profile);

  if (!email) {
    throw new Error(`${provider} account email is required`);
  }

  const providerIdField = provider === 'linkedin' ? 'linkedinId' : 'googleId';
  const providerId = profile.id;
  const existingUser = await User.findOne({
    $or: [{ [providerIdField]: providerId }, { email }]
  });

  if (!existingUser) {
    const payload = {
      fullName,
      email,
      profileImage,
      authProvider: provider,
      isVerified: true,
      interests: [],
      networkingGoals: [],
      reputationScore: 0
    };

    payload[providerIdField] = providerId;

    if (provider === 'linkedin') {
      payload.linkedinUrl = normalizeLinkedInUrl(getLinkedInUrl(profile));
    }

    return User.create(payload);
  }

  existingUser[providerIdField] = existingUser[providerIdField] || providerId;
  existingUser.authProvider = provider;
  if (provider === 'linkedin') {
    existingUser.profileImage = profileImage || existingUser.profileImage;
  } else {
    existingUser.profileImage = existingUser.profileImage || profileImage;
  }
  existingUser.isVerified = true;

  if (!existingUser.fullName) {
    existingUser.fullName = fullName;
  }

  if (provider === 'linkedin' && !existingUser.linkedinUrl) {
    existingUser.linkedinUrl = normalizeLinkedInUrl(getLinkedInUrl(profile));
  }

  await existingUser.save();
  return existingUser;
}