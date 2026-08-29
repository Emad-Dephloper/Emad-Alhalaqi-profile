import { db } from './src/db/index.js';
import { posts } from './src/db/schema.js';
import { desc } from 'drizzle-orm';

async function main() {
  try {
    await db.query.posts.findMany({ orderBy: (posts, { desc }) => [desc(posts.createdAt)] });
  } catch (err) {
    console.log("ERR:", err.message);
    if (err.cause) console.log("CAUSE:", err.cause);
  }
}
main();
