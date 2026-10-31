import { HttpError } from '../lib/HttpError.js';
import * as projectRepository from '../repositories/project.repository.js';
import { slugify } from '../utils/slugify.js';

export function listPublicProjects(options) {
  return projectRepository.listProjects({ ...options, includeUnpublished: false });
}

export function listAdminProjects(options = {}) {
  return projectRepository.listProjects({ ...options, includeUnpublished: true, limit: 100 });
}

export async function getPublicProject(slug) {
  const project = await projectRepository.getProjectBySlug(slug);
  if (!project) throw new HttpError(404, 'Project not found');
  return project;
}

export async function getAdminProject(id) {
  const project = await projectRepository.getProjectById(id);
  if (!project) throw new HttpError(404, 'Project not found');
  return project;
}

function normalize(data) {
  const slug = data.slug || slugify(data.title);
  if (!slug) throw new HttpError(422, 'Validation failed', { slug: 'Unable to generate a slug' });
  return { ...data, slug };
}

export async function createProject(data) {
  return projectRepository.createProject(normalize(data));
}

export async function updateProject(id, data) {
  const project = await projectRepository.updateProject(id, normalize(data));
  if (!project) throw new HttpError(404, 'Project not found');
  return project;
}

export async function deleteProject(id) {
  const deleted = await projectRepository.deleteProject(id);
  if (!deleted) throw new HttpError(404, 'Project not found');
}

export const listTechnologies = () => projectRepository.listTechnologies();
