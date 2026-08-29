import { db } from './src/db/index.js';
import { experience } from './src/db/schema.js';

async function main() {
  try {
    const data = await db.select().from(experience);
    console.log("Experience count:", data.length);
  } catch (err) {
    console.error("Error:", err);
  }
}
main();
