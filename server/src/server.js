import app from './app.js';
import db from './config/db.js';
import { env } from './config/env.js';

async function start() {
  try {
    await db.raw('select 1');
    console.log('MySQL connected');
  } catch (err) {
    console.error('Could not connect to MySQL. Is Laragon running and is the database created?');
    console.error(err.message);
    process.exit(1);
  }
  app.listen(env.port, () => console.log(`API running on http://localhost:${env.port}`));
}

start();
