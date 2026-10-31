import { query } from '../config/database.js';

const columns = `
  id, company, position, employment_type, location,
  start_date::text AS start_date, end_date::text AS end_date,
  is_current, description, technologies, is_published, sort_order,
  created_at, updated_at
`;

export async function listExperiences({ includeUnpublished = false } = {}) {
  const where = includeUnpublished ? '' : 'WHERE is_published = true';
  const { rows } = await query(
    `SELECT ${columns}
     FROM experiences
     ${where}
     ORDER BY sort_order ASC, start_date DESC`,
  );
  return rows;
}

export async function getExperienceById(id) {
  const { rows } = await query(`SELECT ${columns} FROM experiences WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function createExperience(data) {
  const { rows } = await query(
    `INSERT INTO experiences
      (company, position, employment_type, location, start_date, end_date, is_current,
       description, technologies, is_published, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING ${columns}`,
    [
      data.company,
      data.position,
      data.employment_type,
      data.location,
      data.start_date,
      data.is_current ? null : data.end_date,
      data.is_current,
      data.description,
      data.technologies,
      data.is_published,
      data.sort_order,
    ],
  );
  return rows[0];
}

export async function updateExperience(id, data) {
  const { rows } = await query(
    `UPDATE experiences SET
      company = $1,
      position = $2,
      employment_type = $3,
      location = $4,
      start_date = $5,
      end_date = $6,
      is_current = $7,
      description = $8,
      technologies = $9,
      is_published = $10,
      sort_order = $11,
      updated_at = now()
     WHERE id = $12
     RETURNING ${columns}`,
    [
      data.company,
      data.position,
      data.employment_type,
      data.location,
      data.start_date,
      data.is_current ? null : data.end_date,
      data.is_current,
      data.description,
      data.technologies,
      data.is_published,
      data.sort_order,
      id,
    ],
  );
  return rows[0] ?? null;
}

export async function deleteExperience(id) {
  const { rowCount } = await query('DELETE FROM experiences WHERE id = $1', [id]);
  return rowCount > 0;
}
