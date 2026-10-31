import bcrypt from 'bcryptjs';
import { pool, query } from '../src/config/database.js';
import { env } from '../src/config/env.js';

function argument(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  if (index !== -1 && process.argv[index + 1]) return process.argv[index + 1];
  return fallback;
}

const username = argument('username', env.admin.username).trim();
const email = argument('email', env.admin.email).trim().toLowerCase();
const password = argument('password', env.admin.password);

async function main() {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('A valid email is required (--email or ADMIN_EMAIL).');
  }
  if (!/^[a-zA-Z0-9_.-]{3,50}$/.test(username)) {
    throw new Error('Username must be 3-50 characters (letters, numbers, _, ., -).');
  }
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters (--password or ADMIN_PASSWORD).');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await query(
    'SELECT id FROM admin_users WHERE email = $1 OR username = $2 LIMIT 1',
    [email, username],
  );

  if (existing.rows.length > 0) {
    await query(
      'UPDATE admin_users SET password_hash = $1, updated_at = now() WHERE id = $2',
      [passwordHash, existing.rows[0].id],
    );
    console.log(`[admin] Password updated for ${email}`);
  } else {
    await query(
      'INSERT INTO admin_users (username, email, password_hash) VALUES ($1, $2, $3)',
      [username, email, passwordHash],
    );
    console.log(`[admin] Administrator created: ${email} (username: ${username})`);
  }
}

main()
  .catch((error) => {
    console.error('[admin] Failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
