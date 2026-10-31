import { asyncHandler } from '../lib/HttpError.js';
import * as projectService from '../services/project.service.js';

export const listPublicProjects = asyncHandler(async (req, res) => {
  const { featured, page, limit, search } = req.validatedQuery;
  const result = await projectService.listPublicProjects({
    featured: featured === undefined ? undefined : featured === 'true',
    page,
    limit,
    search,
  });

  res.json({
    success: true,
    message: 'Projects retrieved',
    data: result,
  });
});

export const getPublicProject = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Project retrieved',
    data: await projectService.getPublicProject(req.params.slug),
  });
});

export const listAdminProjects = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Projects retrieved',
    data: await projectService.listAdminProjects(),
  });
});

export const getAdminProject = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Project retrieved',
    data: await projectService.getAdminProject(req.validatedParams.id),
  });
});

export const createProject = asyncHandler(async (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: await projectService.createProject(req.body),
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Project updated successfully',
    data: await projectService.updateProject(req.validatedParams.id, req.body),
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(req.validatedParams.id);
  res.json({ success: true, message: 'Project deleted successfully' });
});

export const listTechnologies = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Technologies retrieved',
    data: await projectService.listTechnologies(),
  });
});
