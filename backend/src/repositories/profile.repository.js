import { query } from '../config/database.js';

const columns = `id, full_name, headline, about, profile_image, location, updated_at`;

export async function getProfile() {
  const { rows } = await query(`SELECT ${columns} FROM profile ORDER BY id LIMIT 1`);
  return rows[0] ?? null;
}

export async function saveProfile(data) {
  const { rows } = await query(
    `INSERT INTO profile (id, full_name, headline, about, profile_image, location, updated_at)
     VALUES (1, $1, $2, $3, $4, $5, now())
     ON CONFLICT (id) DO UPDATE SET
       full_name = EXCLUDED.full_name,
       headline = EXCLUDED.headline,
       about = EXCLUDED.about,
       profile_image = EXCLUDED.profile_image,
       location = EXCLUDED.location,
       updated_at = now()
     RETURNING ${columns}`,
    [data.full_name, data.headline, data.about, data.profile_image, data.location],
  );
  return rows[0];
}
