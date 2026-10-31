const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Double-submit style CSRF protection for cookie-based sessions: the token is
 * kept in the server-side session and must be echoed in the X-CSRF-Token header
 * on every state-changing request.
 */
export function csrfProtection(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();

  const expected = req.session?.csrfToken;
  const received = req.get('x-csrf-token');

  if (!expected || !received || received !== expected) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or missing CSRF token',
    });
  }

  return next();
}
