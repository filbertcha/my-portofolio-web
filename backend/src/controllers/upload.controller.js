import { asyncHandler, HttpError } from '../lib/HttpError.js';
import { storeImage } from '../lib/storage.js';
import { detectImage } from '../utils/image.js';

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file?.buffer?.length) {
    throw new HttpError(422, 'An image file is required', { image: 'Choose an image to upload' });
  }

  const detected = detectImage(req.file.buffer);
  if (!detected) {
    throw new HttpError(422, 'Unsupported image format', {
      image: 'Use a JPEG, PNG, WebP, or GIF image',
    });
  }

  const { url } = await storeImage({
    buffer: req.file.buffer,
    extension: detected.extension,
    mime: detected.mime,
  });

  res.status(201).json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      url,
      mime_type: detected.mime,
      size: req.file.size,
    },
  });
});
