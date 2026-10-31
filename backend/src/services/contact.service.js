import * as contactRepository from '../repositories/contact.repository.js';

export const getContact = () => contactRepository.getContact();

export const updateContact = (data) => contactRepository.saveContact(data);
