import { HttpError } from '../lib/HttpError.js';
import * as experienceRepository from '../repositories/experience.repository.js';

export const listPublicExperiences = () =>
  experienceRepository.listExperiences({ includeUnpublished: false });

export const listAdminExperiences = () =>
  experienceRepository.listExperiences({ includeUnpublished: true });

export async function getExperience(id) {
  const experience = await experienceRepository.getExperienceById(id);
  if (!experience) throw new HttpError(404, 'Experience not found');
  return experience;
}

export const createExperience = (data) => experienceRepository.createExperience(data);

export async function updateExperience(id, data) {
  const experience = await experienceRepository.updateExperience(id, data);
  if (!experience) throw new HttpError(404, 'Experience not found');
  return experience;
}

export async function deleteExperience(id) {
  const deleted = await experienceRepository.deleteExperience(id);
  if (!deleted) throw new HttpError(404, 'Experience not found');
}
