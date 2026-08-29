import { db } from './src/db/index.js';
import { pageViews } from './src/db/schema.js';

async function main() {
  try {
    await db.insert(pageViews).values({ path: '/' });
    console.log("Success");
  } catch (err) {
    console.error("DB Error:", err);
  }
}
main();
