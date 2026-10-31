import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../config/env.js';
import { asyncHandler, HttpError } from '../lib/HttpError.js';
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

  const filename = `${Date.now()}-${crypto.randomUUID()}.${detected.extension}`;
  await fs.mkdir(env.uploadDir, { recursive: true });
  await fs.writeFile(path.join(env.uploadDir, filename), req.file.buffer);

  res.status(201).json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      url: `/uploads/${filename}`,
      mime_type: detected.mime,
      size: req.file.size,
    },
  });
});
