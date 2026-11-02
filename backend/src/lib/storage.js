import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../config/env.js';
import { HttpError } from './HttpError.js';

/**
 * Persists an uploaded image and returns the public URL to store in the database.
 *
 * Supabase Storage is used whenever SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are
 * configured. This is required on serverless platforms (Vercel) where the local
 * filesystem is read-only and ephemeral. Locally we fall back to the uploads
 * directory so development works without any cloud credentials.
 *
 * @param {{ buffer: Buffer, extension: string, mime: string }} image
 * @returns {Promise<{ url: string, filename: string }>}
 */
export async function storeImage({ buffer, extension, mime }) {
  const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  if (env.useSupabaseStorage) {
    const url = await uploadToSupabase({ buffer, filename, mime });
    return { url, filename };
  }

  await fs.mkdir(env.uploadDir, { recursive: true });
  await fs.writeFile(path.join(env.uploadDir, filename), buffer);
  return { url: `/uploads/${filename}`, filename };
}

async function uploadToSupabase({ buffer, filename, mime }) {
  const objectPath = `uploads/${filename}`;
  const endpoint = `${env.supabaseUrl}/storage/v1/object/${encodeURIComponent(
    env.supabaseBucket,
  )}/${objectPath}`;

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.supabaseServiceRoleKey}`,
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=31536000, immutable',
        // Never silently overwrite: filenames are already unique.
        'x-upsert': 'false',
      },
      body: buffer,
    });
  } catch (error) {
    console.error('[storage] Could not reach Supabase Storage:', error);
    throw new HttpError(502, 'Image storage is unavailable. Please try again.');
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error(
      `[storage] Supabase upload failed (${response.status}):`,
      detail || response.statusText,
    );

    if (response.status === 404) {
      throw new HttpError(
        502,
        `Image storage bucket "${env.supabaseBucket}" was not found. Create it in Supabase Storage and try again.`,
      );
    }

    throw new HttpError(502, 'Could not save the image. Please try again.');
  }

  return `${env.supabaseUrl}/storage/v1/object/public/${encodeURIComponent(
    env.supabaseBucket,
  )}/${objectPath}`;
}
