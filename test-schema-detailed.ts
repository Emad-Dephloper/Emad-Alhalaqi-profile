import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    const res = await db.execute(sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'testimonials';
    `);
    console.log("Columns:", res.rows);
  } catch (err) {
    console.error("Error:", err);
  }
}
main();
