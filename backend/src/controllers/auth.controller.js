import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { asyncHandler, HttpError } from '../lib/HttpError.js';
import * as authRepository from '../repositories/auth.repository.js';
import { env } from '../config/env.js';
import { sessionCookieOptions } from '../config/session.js';

// A valid hash so the comparison always takes a similar amount of time even
// when the account does not exist (mitigates user enumeration via timing).
const dummyHash = bcrypt.hashSync(crypto.randomUUID(), 10);

const publicUser = ({ password_hash: _passwordHash, ...user }) => user;

export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const account = await authRepository.findByIdentifier(identifier);
  const passwordMatches = await bcrypt.compare(password, account?.password_hash || dummyHash);

  if (!account || !passwordMatches) {
    throw new HttpError(401, 'Invalid email/username or password');
  }

  const csrfToken = crypto.randomBytes(32).toString('hex');

  await new Promise((resolve, reject) => {
    req.session.regenerate((error) => (error ? reject(error) : resolve()));
  });

  req.session.userId = account.id;
  req.session.csrfToken = csrfToken;

  await new Promise((resolve, reject) => {
    req.session.save((error) => (error ? reject(error) : resolve()));
  });

  res.json({
    success: true,
    message: 'Signed in successfully',
    data: {
      user: publicUser(account),
      csrfToken,
    },
  });
});

export const me = asyncHandler(async (req, res) => {
  if (!req.session?.userId) {
    throw new HttpError(401, 'Authentication required');
  }

  const user = await authRepository.findById(req.session.userId);
  if (!user) {
    req.session.destroy(() => {});
    throw new HttpError(401, 'Authentication required');
  }

  res.json({
    success: true,
    message: 'Authenticated',
    data: {
      user,
      csrfToken: req.session.csrfToken ?? null,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  await new Promise((resolve) => {
    req.session.destroy(() => resolve());
  });

  res.clearCookie(env.cookieName, sessionCookieOptions);
  res.json({ success: true, message: 'Signed out successfully' });
});
