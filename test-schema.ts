import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    const res = await db.execute(sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'posts';
    `);
    console.log("Columns in DB:", res.rows.map((r: any) => r.column_name));
  } catch (err) {
    console.error("Error:", err);
  }
}
main();
