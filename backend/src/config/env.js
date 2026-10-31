import 'dotenv/config';
import path from 'node:path';

const bool = (value, fallback = false) => {
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const number = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

export const env = {
  nodeEnv,
  isProduction,
  port: number(process.env.PORT, 3000),

  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/personal_portfolio',
  databaseSsl: bool(process.env.DATABASE_SSL, false),

  sessionSecret: process.env.SESSION_SECRET || 'insecure-development-secret',
  cookieSecure: bool(process.env.COOKIE_SECURE, isProduction),
  sessionMaxAgeDays: number(process.env.SESSION_MAX_AGE_DAYS, 7),
  cookieName: 'portfolio.sid',

  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),

  uploadDir: path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads'),
  maxUploadBytes: number(process.env.MAX_UPLOAD_MB, 5) * 1024 * 1024,

  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || '',
  },
};

if (isProduction && env.sessionSecret === 'insecure-development-secret') {
  throw new Error('SESSION_SECRET must be set in production.');
}
