import * as profileRepository from '../repositories/profile.repository.js';

export const getProfile = () => profileRepository.getProfile();

export const updateProfile = (data) => profileRepository.saveProfile(data);
