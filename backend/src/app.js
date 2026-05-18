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

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
