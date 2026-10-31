import multer from 'multer';
import { env } from '../config/env.js';
import { HttpError } from '../lib/HttpError.js';

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.maxUploadBytes,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype?.startsWith('image/')) {
      return callback(new HttpError(422, 'Only image files are allowed'));
    }
    return callback(null, true);
  },
}).single('image');
