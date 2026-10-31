import { asyncHandler } from '../lib/HttpError.js';
import * as profileService from '../services/profile.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Profile retrieved',
    data: await profileService.getProfile(),
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: await profileService.updateProfile(req.body),
  });
});
