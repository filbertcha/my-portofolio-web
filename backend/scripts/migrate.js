import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, query } from '../src/config/database.js';
import { env } from '../src/config/env.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.resolve(dirname, '../migrations');

async function migrate() {
  console.log(`[migrate] Database: ${env.databaseUrl.replace(/:\/\/[^@]+@/, '://***@')}`);

  await query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  const { rows } = await query('SELECT filename FROM schema_migrations');
  const applied = new Set(rows.map((row) => row.filename));

  let count = 0;
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`[migrate] Skipping ${file} (already applied)`);
      continue;
    }

    const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`[migrate] Applied ${file}`);
      count += 1;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`[migrate] Failed to apply ${file}:`, error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  console.log(
    count === 0
      ? '[migrate] Database is up to date.'
      : `[migrate] Applied ${count} migration(s).`,
  );
}

migrate()
  .catch(() => {
    process.exitCode = 1;
  })
  .finally(() => pool.end());
