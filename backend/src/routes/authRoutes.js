import { Router } from 'express';
import passport from 'passport';
import {
  googleAuthFailure,
  googleAuthSuccess,
  getCurrentUser,
  linkedinCallback,
  linkedinLogin,
  logoutUser
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

// Add security headers to auth routes
router.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: true
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL || 'https://syncly-six.vercel.app'}/login`,
    session: true
  }),
  googleAuthSuccess
);

router.get('/google/failure', googleAuthFailure);

router.get('/linkedin', linkedinLogin);
router.get('/linkedin/callback', linkedinCallback);
router.get('/linkedin/callback/', linkedinCallback);
router.get('/me', protect, getCurrentUser);
router.post('/logout', logoutUser);
router.get('/logout', logoutUser);

export default router;