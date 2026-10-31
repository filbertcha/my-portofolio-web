import { asyncHandler } from '../lib/HttpError.js';
import * as educationService from '../services/education.service.js';

export const listPublicEducation = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Education retrieved',
    data: await educationService.listPublicEducation(),
  });
});

export const listAdminEducation = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Education retrieved',
    data: await educationService.listAdminEducation(),
  });
});

export const getAdminEducation = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Education retrieved',
    data: await educationService.getEducation(req.validatedParams.id),
  });
});

export const createEducation = asyncHandler(async (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Education created successfully',
    data: await educationService.createEducation(req.body),
  });
});

export const updateEducation = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Education updated successfully',
    data: await educationService.updateEducation(req.validatedParams.id, req.body),
  });
});

export const deleteEducation = asyncHandler(async (req, res) => {
  await educationService.deleteEducation(req.validatedParams.id);
  res.json({ success: true, message: 'Education deleted successfully' });
});
