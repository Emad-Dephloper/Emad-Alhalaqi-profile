import { db } from './src/db/index.ts';
import { sql } from 'drizzle-orm';

async function main() {
  await db.execute(sql`DROP TABLE IF EXISTS experience;`);
  await db.execute(sql`DROP TABLE IF EXISTS education;`);
  console.log("Tables dropped.");
  process.exit(0);
}

main();
