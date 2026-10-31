import { env } from '../config/env.js';
import { HttpError } from '../lib/HttpError.js';

export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(error, req, res, next) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      success: false,
      message: error.message,
      ...(error.errors ? { errors: error.errors } : {}),
    });
  }

  if (error?.code === '23505') {
    const constraint = error.constraint || '';
    const field = constraint.includes('slug')
      ? 'slug'
      : constraint.includes('email')
        ? 'email'
        : constraint.includes('username')
          ? 'username'
          : null;

    return res.status(409).json({
      success: false,
      message: field
        ? `That ${field} is already in use`
        : 'A record with the same unique value already exists',
      ...(field ? { errors: { [field]: `That ${field} is already in use` } } : {}),
    });
  }

  if (error?.code === '23503') {
    return res.status(409).json({
      success: false,
      message: 'This record is still referenced by other data',
    });
  }

  if (error?.name === 'MulterError') {
    const tooLarge = error.code === 'LIMIT_FILE_SIZE';
    return res.status(tooLarge ? 413 : 422).json({
      success: false,
      message: tooLarge ? 'The uploaded image is too large' : error.message,
    });
  }

  if (error?.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Request body is too large',
    });
  }

  console.error('[api] Unhandled error:', error);

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(env.isProduction ? {} : { detail: error?.message }),
  });
}
