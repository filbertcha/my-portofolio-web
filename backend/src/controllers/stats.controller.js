import { asyncHandler } from '../lib/HttpError.js';
import * as statsService from '../services/stats.service.js';

export const getStats = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Dashboard statistics retrieved',
    data: await statsService.getStats(),
  });
});
