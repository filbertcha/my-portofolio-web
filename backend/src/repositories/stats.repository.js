import { query } from '../config/database.js';

export async function getStats() {
  const { rows } = await query(
    `SELECT
       (SELECT COUNT(*)::int FROM projects) AS total_projects,
       (SELECT COUNT(*)::int FROM projects WHERE is_published = true) AS published_projects,
       (SELECT COUNT(*)::int FROM projects WHERE is_featured = true) AS featured_projects,
       (SELECT COUNT(*)::int FROM experiences) AS total_experiences,
       (SELECT COUNT(*)::int FROM education) AS total_education`,
  );
  return rows[0];
}
