import { query } from '../config/database.js';

const columns = `id, email, phone, github_url, linkedin_url, website_url, location, updated_at`;

export async function getContact() {
  const { rows } = await query(`SELECT ${columns} FROM contacts ORDER BY id LIMIT 1`);
  return rows[0] ?? null;
}

export async function saveContact(data) {
  const { rows } = await query(
    `INSERT INTO contacts (id, email, phone, github_url, linkedin_url, website_url, location, updated_at)
     VALUES (1, $1, $2, $3, $4, $5, $6, now())
     ON CONFLICT (id) DO UPDATE SET
       email = EXCLUDED.email,
       phone = EXCLUDED.phone,
       github_url = EXCLUDED.github_url,
       linkedin_url = EXCLUDED.linkedin_url,
       website_url = EXCLUDED.website_url,
       location = EXCLUDED.location,
       updated_at = now()
     RETURNING ${columns}`,
    [
      data.email,
      data.phone,
      data.github_url,
      data.linkedin_url,
      data.website_url,
      data.location,
    ],
  );
  return rows[0];
}
