import { query } from '../config/database.js';

const columns = `
  id, institution, degree, major,
  start_date::text AS start_date, end_date::text AS end_date,
  is_current, description, is_published, sort_order,
  created_at, updated_at
`;

export async function listEducation({ includeUnpublished = false } = {}) {
  const where = includeUnpublished ? '' : 'WHERE is_published = true';
  const { rows } = await query(
    `SELECT ${columns}
     FROM education
     ${where}
     ORDER BY sort_order ASC, start_date DESC NULLS LAST`,
  );
  return rows;
}

export async function getEducationById(id) {
  const { rows } = await query(`SELECT ${columns} FROM education WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function createEducation(data) {
  const { rows } = await query(
    `INSERT INTO education
      (institution, degree, major, start_date, end_date, is_current,
       description, is_published, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING ${columns}`,
    [
      data.institution,
      data.degree,
      data.major,
      data.start_date,
      data.is_current ? null : data.end_date,
      data.is_current,
      data.description,
      data.is_published,
      data.sort_order,
    ],
  );
  return rows[0];
}

export async function updateEducation(id, data) {
  const { rows } = await query(
    `UPDATE education SET
      institution = $1,
      degree = $2,
      major = $3,
      start_date = $4,
      end_date = $5,
      is_current = $6,
      description = $7,
      is_published = $8,
      sort_order = $9,
      updated_at = now()
     WHERE id = $10
     RETURNING ${columns}`,
    [
      data.institution,
      data.degree,
      data.major,
      data.start_date,
      data.is_current ? null : data.end_date,
      data.is_current,
      data.description,
      data.is_published,
      data.sort_order,
      id,
    ],
  );
  return rows[0] ?? null;
}

export async function deleteEducation(id) {
  const { rowCount } = await query('DELETE FROM education WHERE id = $1', [id]);
  return rowCount > 0;
}
