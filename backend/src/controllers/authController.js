import { generateToken } from '../utils/generateToken.js';
import { buildLinkedInLoginUrl, exchangeLinkedInCallback } from '../services/linkedinOidcService.js';
import { upsertOAuthUser } from '../services/authService.js';

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

function buildAuthSuccessRedirect(token) {
  const clientUrl = process.env.CLIENT_URL || 'https://syncly-six.vercel.app';
  // Use URL hash so token is not sent back to the server in request logs.
  return `${clientUrl}/auth/success#token=${encodeURIComponent(token)}`;
}

export function googleAuthSuccess(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: 'Google authentication failed' });
  }

  const token = generateToken(req.user._id);
  setAuthCookie(res, token);

  return res.redirect(buildAuthSuccessRedirect(token));
}

export async function linkedinLogin(req, res, next) {
  try {
    const authorizationUrl = await buildLinkedInLoginUrl(req);

    return req.session.save((saveError) => {
      if (saveError) {
        return next(saveError);
      }

      return res.redirect(authorizationUrl.href);
    });
  } catch (error) {
    return next(error);
  }
}

export function googleAuthFailure(req, res) {
  return res.status(401).json({ message: 'Google authentication failed' });
}

export async function linkedinCallback(req, res, next) {
  try {
    if (req.query.error) {
      return res.redirect(`${process.env.CLIENT_URL || 'https://syncly-six.vercel.app'}/login?error=linkedin`);
    }

    const { profile } = await exchangeLinkedInCallback(req);
    const user = await upsertOAuthUser('linkedin', profile);
    const token = generateToken(user._id);
    setAuthCookie(res, token);

    return res.redirect(buildAuthSuccessRedirect(token));
  } catch (error) {
    return next(error);
  }
}

export function logoutUser(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });

  if (typeof req.logout === 'function') {
    req.logout(() => {
      res.clearCookie('connect.sid');
      return res.json({ message: 'Signed out successfully' });
    });
    return;
  }

  res.clearCookie('connect.sid');
  return res.json({ message: 'Signed out successfully' });
}

export function getCurrentUser(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  return res.json({
    user: req.user,
    token: generateToken(req.user._id)
  });
}
