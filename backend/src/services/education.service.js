import { HttpError } from '../lib/HttpError.js';
import * as educationRepository from '../repositories/education.repository.js';

export const listPublicEducation = () =>
  educationRepository.listEducation({ includeUnpublished: false });

export const listAdminEducation = () =>
  educationRepository.listEducation({ includeUnpublished: true });

export async function getEducation(id) {
  const education = await educationRepository.getEducationById(id);
  if (!education) throw new HttpError(404, 'Education not found');
  return education;
}

export const createEducation = (data) => educationRepository.createEducation(data);

export async function updateEducation(id, data) {
  const education = await educationRepository.updateEducation(id, data);
  if (!education) throw new HttpError(404, 'Education not found');
  return education;
}

export async function deleteEducation(id) {
  const deleted = await educationRepository.deleteEducation(id);
  if (!deleted) throw new HttpError(404, 'Education not found');
}
