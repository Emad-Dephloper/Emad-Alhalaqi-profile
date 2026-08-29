import { db } from './src/db/index.js';
import { testimonials } from './src/db/schema.js';

async function main() {
  const data = await db.select().from(testimonials);
  console.log("Data:", JSON.stringify(data, null, 2));
}
main();
