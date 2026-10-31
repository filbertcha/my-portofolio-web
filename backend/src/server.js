import { app } from './app.js';
import { env } from './config/env.js';
import { pool } from './config/database.js';

const server = app.listen(env.port, () => {
  console.log(`[api] Listening on http://localhost:${env.port}/api (${env.nodeEnv})`);
});

pool
  .query('SELECT 1')
  .then(() => console.log('[api] PostgreSQL connection established'))
  .catch((error) => {
    console.error('[api] Could not reach PostgreSQL:', error.message);
    console.error('[api] Check DATABASE_URL in backend/.env and run `npm run db:setup`.');
  });

async function shutdown(signal) {
  console.log(`\n[api] ${signal} received, shutting down...`);
  server.close(async () => {
    await pool.end().catch(() => {});
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
