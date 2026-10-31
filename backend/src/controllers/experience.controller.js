import { asyncHandler } from '../lib/HttpError.js';
import * as experienceService from '../services/experience.service.js';

export const listPublicExperiences = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Experiences retrieved',
    data: await experienceService.listPublicExperiences(),
  });
});

export const listAdminExperiences = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Experiences retrieved',
    data: await experienceService.listAdminExperiences(),
  });
});

export const getAdminExperience = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Experience retrieved',
    data: await experienceService.getExperience(req.validatedParams.id),
  });
});

export const createExperience = asyncHandler(async (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Experience created successfully',
    data: await experienceService.createExperience(req.body),
  });
});

export const updateExperience = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Experience updated successfully',
    data: await experienceService.updateExperience(req.validatedParams.id, req.body),
  });
});

export const deleteExperience = asyncHandler(async (req, res) => {
  await experienceService.deleteExperience(req.validatedParams.id);
  res.json({ success: true, message: 'Experience deleted successfully' });
});
