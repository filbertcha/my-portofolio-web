import { query } from '../config/database.js';

const publicColumns = 'id, username, email, created_at, updated_at';

export async function findByIdentifier(identifier) {
  const { rows } = await query(
    `SELECT ${publicColumns}, password_hash
     FROM admin_users
     WHERE email = $1 OR username = $1
     LIMIT 1`,
    [identifier],
  );
  return rows[0] ?? null;
}

export async function findById(id) {
  const { rows } = await query(
    `SELECT ${publicColumns} FROM admin_users WHERE id = $1 LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function createAdmin({ username, email, passwordHash }) {
  const { rows } = await query(
    `INSERT INTO admin_users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING ${publicColumns}`,
    [username, email, passwordHash],
  );
  return rows[0];
}
