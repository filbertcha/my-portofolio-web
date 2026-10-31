import { asyncHandler } from '../lib/HttpError.js';
import * as contactService from '../services/contact.service.js';

export const getContact = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Contact information retrieved',
    data: await contactService.getContact(),
  });
});

export const updateContact = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Contact information updated successfully',
    data: await contactService.updateContact(req.body),
  });
});
