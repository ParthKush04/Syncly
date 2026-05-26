import * as oidc from 'openid-client';

const linkedInServerMetadata = {
  issuer: 'https://www.linkedin.com',
  authorization_endpoint: 'https://www.linkedin.com/oauth/v2/authorization',
  token_endpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
  userinfo_endpoint: 'https://api.linkedin.com/v2/userinfo',
  jwks_uri: 'https://www.linkedin.com/oauth/openid/jwks',
  token_endpoint_auth_methods_supported: ['client_secret_post'],
  response_types_supported: ['code'],
  subject_types_supported: ['pairwise'],
  id_token_signing_alg_values_supported: ['RS256'],
  scopes_supported: ['openid', 'profile', 'email'],
  claims_supported: ['iss', 'aud', 'iat', 'exp', 'sub', 'name', 'given_name', 'family_name', 'picture', 'email', 'email_verified', 'locale']
};

const linkedInScopes = (process.env.LINKEDIN_SCOPE || 'openid profile email')
  .split(/[\s,]+/)
  .map((scope) => scope.trim())
  .filter(Boolean);

function getLinkedInCallbackUrl(req) {
  if (process.env.LINKEDIN_CALLBACK_URL) {
    return process.env.LINKEDIN_CALLBACK_URL;
  }

  const forwardedProto = String(req?.headers?.['x-forwarded-proto'] || '').split(',')[0].trim();
  const forwardedHost = String(req?.headers?.['x-forwarded-host'] || '').split(',')[0].trim();
  const protocol = forwardedProto || req?.protocol || 'https';
  const host = forwardedHost || req?.get?.('host') || '';

  return `${protocol}://${host}/api/auth/linkedin/callback`;
}

let configPromise;

async function getLinkedInConfig() {
  if (!configPromise) {
    configPromise = Promise.resolve(
      new oidc.Configuration(
        linkedInServerMetadata,
        process.env.LINKEDIN_CLIENT_ID,
        process.env.LINKEDIN_CLIENT_SECRET,
        oidc.ClientSecretPost(process.env.LINKEDIN_CLIENT_SECRET)
      )
    );
  }

  return configPromise;
}

function extractLinkedInPictureUrl(picture) {
  if (!picture) {
    return '';
  }

  if (typeof picture === 'string') {
    return picture.trim();
  }

  if (typeof picture !== 'object') {
    return '';
  }

  const directUrl = picture.value || picture.url || picture.picture || picture.imageUrl;

  if (typeof directUrl === 'string' && directUrl.trim()) {
    return directUrl.trim();
  }

  const decoratedImage = picture['displayImage~'] || picture.displayImageDecorated || picture.displayImage;

  const decoratedUrl = decoratedImage?.elements?.[0]?.identifiers?.[0]?.identifier;

  if (typeof decoratedUrl === 'string' && decoratedUrl.trim()) {
    return decoratedUrl.trim();
  }

  return '';
}

export async function buildLinkedInLoginUrl(req) {
  const config = await getLinkedInConfig();
  const state = oidc.randomState();
  const redirectUri = getLinkedInCallbackUrl(req);

  req.session.linkedinOidc = {
    state
  };

  const parameters = new URLSearchParams({
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: linkedInScopes.join(' '),
    state
  });

  return oidc.buildAuthorizationUrl(config, parameters);
}

function normalizeLinkedInProfile(claims, userInfo) {
  const profile = {
    ...claims,
    ...userInfo
  };

  const pictureUrl = extractLinkedInPictureUrl(profile.picture);

  const fullName = profile.name || [profile.given_name, profile.family_name].filter(Boolean).join(' ') || 'LinkedIn User';

  return {
    provider: 'linkedin',
    id: profile.sub || '',
    displayName: fullName,
    name: {
      givenName: profile.given_name || '',
      familyName: profile.family_name || ''
    },
    emails: profile.email ? [{ value: profile.email }] : [],
    photos: pictureUrl ? [{ value: pictureUrl }] : [],
    _json: profile
  };
}

async function fetchLinkedInDecoratedProfile(accessToken) {
  try {
    const response = await fetch('https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      return {};
    }

    return await response.json();
  } catch {
    return {};
  }
}

async function resolveLinkedInPicture(profile) {
  const candidateUrl = profile.picture;

  if (!candidateUrl || candidateUrl.startsWith('data:')) {
    return candidateUrl || '';
  }

  try {
    const response = await fetch(candidateUrl, {
      headers: {
        Accept: 'image/*'
      }
    });

    if (!response.ok) {
      return candidateUrl;
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = Buffer.from(await response.arrayBuffer());
    return `data:${contentType};base64,${imageBuffer.toString('base64')}`;
  } catch {
    return candidateUrl;
  }
}

export async function exchangeLinkedInCallback(req) {
  const config = await getLinkedInConfig();
  const redirectUri = getLinkedInCallbackUrl(req);
  const currentUrl = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
  const code = currentUrl.searchParams.get('code');
  const responseState = currentUrl.searchParams.get('state');
  const sessionState = req.session.linkedinOidc || {};

  if (!code) {
    throw new Error('LinkedIn authorization code is missing');
  }

  if (!sessionState.state || responseState !== sessionState.state) {
    throw new Error('LinkedIn state validation failed');
  }

  const tokenBody = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: process.env.LINKEDIN_CLIENT_ID,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET
  });

  const tokenResponse = await fetch(linkedInServerMetadata.token_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    },
    body: tokenBody
  });

  const tokenText = await tokenResponse.text();
  let tokenPayload = {};

  try {
    tokenPayload = tokenText ? JSON.parse(tokenText) : {};
  } catch {
    tokenPayload = tokenText ? { error: 'invalid_token_response', error_description: tokenText } : {};
  }

  if (!tokenResponse.ok || tokenPayload.error) {
    const error = new Error(tokenPayload.error_description || tokenPayload.error || 'LinkedIn token exchange failed');
    error.response = tokenPayload;
    throw error;
  }

  delete req.session.linkedinOidc;

  const claims = tokenPayload.id_token ? decodeJwtPayload(tokenPayload.id_token) : {};
  const subject = claims.sub || oidc.skipSubjectCheck;
  const userInfo = tokenPayload.access_token
    ? await oidc.fetchUserInfo(config, tokenPayload.access_token, subject)
    : {};
  const decoratedProfile = tokenPayload.access_token
    ? await fetchLinkedInDecoratedProfile(tokenPayload.access_token)
    : {};

  const decoratedPictureUrl = decoratedProfile?.profilePicture
    ? extractLinkedInPictureUrl(decoratedProfile.profilePicture)
    : '';

  return {
    tokens: tokenPayload,
    profile: await (async () => {
      const profile = normalizeLinkedInProfile(claims, userInfo);
      const pictureCandidate = profile.photos[0]?.value || decoratedPictureUrl;

      profile.photos = pictureCandidate
        ? [{ value: await resolveLinkedInPicture({ picture: pictureCandidate }) }]
        : [];

      return profile;
    })()
  };
}

function decodeJwtPayload(idToken) {
  try {
    const payload = idToken.split('.')[1];
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return {};
  }
}
