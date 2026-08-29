import { db } from './src/db/index.js';
import { testimonials } from './src/db/schema.js';
import { eq } from 'drizzle-orm';

async function main() {
  try {
    const data = await db.query.testimonials.findMany({ 
      where: eq(testimonials.published, true),
    });
    console.log("Success:", data.length);
  } catch (err) {
    console.error("ERR:", err.message);
    if (err.cause) console.error("CAUSE:", err.cause);
  }
}
main();
