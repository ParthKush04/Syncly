import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import passport from 'passport';
import apiRoutes from './routes/index.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import { configurePassport } from './config/passport.js';

export async function createApp() {
  const app = express();

  // Required on Render/other proxies so secure cookies and session handling work correctly.
  app.set('trust proxy', 1);

  const allowedOrigins = new Set(
    String(process.env.CLIENT_URL || 'https://syncly-six.vercel.app')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  );

  // Allow localhost during development for the frontend dev server.
  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.add('http://localhost:5174');
  }

  // Strengthen security headers to prevent Chrome Safe Browsing blocks
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:', 'https://media-exp1.licdn.com', 'https://lh3.googleusercontent.com'],
        connectSrc: ["'self'", 'https://www.linkedin.com', 'https://api.linkedin.com'],
        frameSrc: ["'self'", 'https://www.linkedin.com', 'https://accounts.google.com'],
        baseUri: ["'self'"],
        formAction: ["'self'", 'https://www.linkedin.com', 'https://accounts.google.com']
      }
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    noSniff: true,
    xssFilter: true
  }));

  app.use(
    cors({
      origin(origin, callback) {
        // Allow non-browser tools (no Origin header) and configured browser origins.
        if (!origin || allowedOrigins.has(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`CORS origin not allowed: ${origin}`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'dev-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
      }
    })
  );
  await configurePassport();
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(morgan('dev'));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));

  app.get('/', (req, res) => {
    res.json({ message: 'Networking platform API' });
  });
  app.use('/api', apiRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
