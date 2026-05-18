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

  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        // Allow non-browser tools (no Origin header) and configured browser origins.
        if (!origin || allowedOrigins.has(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`CORS origin not allowed: ${origin}`));
      },
      credentials: true
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
