import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { sessionMiddleware } from './config/session.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { requireAuth } from './middlewares/requireAuth.js';
import { csrfProtection } from './middlewares/csrf.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import publicRoutes from './routes/public.routes.js';

export const app = express();

app.disable('x-powered-by');
app.set('trust proxy', env.isProduction ? 1 : 0);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
    maxAge: 600,
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

app.use('/uploads', express.static(env.uploadDir, { maxAge: '7d', fallthrough: true }));

app.use(sessionMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/admin', requireAuth, csrfProtection, adminRoutes);
app.use('/api', publicRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
