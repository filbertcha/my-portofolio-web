import { query, withTransaction } from '../config/database.js';
import { slugify } from '../utils/slugify.js';

const columns = `
  p.id, p.title, p.slug, p.short_description, p.description, p.image_url,
  p.github_url, p.demo_url, p.is_featured, p.is_published, p.sort_order,
  p.start_date::text AS start_date, p.end_date::text AS end_date,
  p.created_at, p.updated_at,
  COALESCE(
    json_agg(
      json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
      ORDER BY t.name
    ) FILTER (WHERE t.id IS NOT NULL),
    '[]'::json
  ) AS technologies
`;

const joins = `
  FROM projects p
  LEFT JOIN project_technologies pt ON pt.project_id = p.id
  LEFT JOIN technologies t ON t.id = pt.technology_id
`;

export async function listProjects({
  includeUnpublished = false,
  featured,
  page = 1,
  limit = 24,
  search,
} = {}) {
  const conditions = [];
  const params = [];

  if (!includeUnpublished) {
    params.push(true);
    conditions.push(`p.is_published = $${params.length}`);
  }
  if (featured === true) {
    params.push(true);
    conditions.push(`p.is_featured = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(p.title ILIKE $${params.length} OR p.short_description ILIKE $${params.length})`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const listParams = [...params, limit, offset];
  const limitIndex = params.length + 1;
  const offsetIndex = params.length + 2;

  const [itemsResult, countResult] = await Promise.all([
    query(
      `SELECT ${columns}
       ${joins}
       ${where}
       GROUP BY p.id
       ORDER BY p.sort_order ASC, p.created_at DESC
       LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
      listParams,
    ),
    query(`SELECT COUNT(*)::int AS total FROM projects p ${where}`, params),
  ]);

  return {
    items: itemsResult.rows,
    total: countResult.rows[0].total,
    page,
    limit,
  };
}

export async function getProjectBySlug(slug) {
  const { rows } = await query(
    `SELECT ${columns}
     ${joins}
     WHERE p.slug = $1 AND p.is_published = true
     GROUP BY p.id`,
    [slug],
  );
  return rows[0] ?? null;
}

export async function getProjectById(id) {
  const { rows } = await query(
    `SELECT ${columns}
     ${joins}
     WHERE p.id = $1
     GROUP BY p.id`,
    [id],
  );
  return rows[0] ?? null;
}

async function syncTechnologies(client, projectId, names) {
  await client.query('DELETE FROM project_technologies WHERE project_id = $1', [projectId]);

  for (const rawName of names ?? []) {
    const name = rawName.trim();
    const technologySlug = slugify(name);
    if (!name || !technologySlug) continue;

    const { rows } = await client.query(
      `INSERT INTO technologies (name, slug)
       VALUES ($1, $2)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [name, technologySlug],
    );

    await client.query(
      `INSERT INTO project_technologies (project_id, technology_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [projectId, rows[0].id],
    );
  }
}

export async function createProject(data) {
  const projectId = await withTransaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO projects
        (title, slug, short_description, description, image_url, github_url, demo_url,
         is_featured, is_published, sort_order, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        data.title,
        data.slug,
        data.short_description,
        data.description,
        data.image_url,
        data.github_url,
        data.demo_url,
        data.is_featured,
        data.is_published,
        data.sort_order,
        data.start_date,
        data.end_date,
      ],
    );
    await syncTechnologies(client, rows[0].id, data.technologies);
    return rows[0].id;
  });

  return getProjectById(projectId);
}

export async function updateProject(id, data) {
  const updated = await withTransaction(async (client) => {
    const { rowCount } = await client.query(
      `UPDATE projects SET
        title = $1,
        slug = $2,
        short_description = $3,
        description = $4,
        image_url = $5,
        github_url = $6,
        demo_url = $7,
        is_featured = $8,
        is_published = $9,
        sort_order = $10,
        start_date = $11,
        end_date = $12,
        updated_at = now()
       WHERE id = $13`,
      [
        data.title,
        data.slug,
        data.short_description,
        data.description,
        data.image_url,
        data.github_url,
        data.demo_url,
        data.is_featured,
        data.is_published,
        data.sort_order,
        data.start_date,
        data.end_date,
        id,
      ],
    );

    if (rowCount === 0) return false;

    await syncTechnologies(client, id, data.technologies);
    return true;
  });

  return updated ? getProjectById(id) : null;
}

export async function deleteProject(id) {
  const { rowCount } = await query('DELETE FROM projects WHERE id = $1', [id]);
  return rowCount > 0;
}

export async function listTechnologies() {
  const { rows } = await query('SELECT id, name, slug FROM technologies ORDER BY name ASC');
  return rows;
}
