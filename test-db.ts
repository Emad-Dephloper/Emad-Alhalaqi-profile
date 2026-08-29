import { db } from './src/db/index.js';
import { projects } from './src/db/schema.js';
import { desc } from 'drizzle-orm';

async function main() {
  try {
    const data = await db.query.projects.findMany({ orderBy: (projects, { desc }) => [desc(projects.createdAt)] });
    console.log("Success:", data.length);
  } catch (err) {
    console.error("Error:", err);
  }
}
main();
