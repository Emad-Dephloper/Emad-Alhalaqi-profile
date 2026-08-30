import { db } from './src/db/index.ts';
import { socialLinks } from './src/db/schema.ts';
import { eq } from 'drizzle-orm';

async function test() {
    try {
        const body = {
            platform: 'test2-updated',
        };
        const data = await db.update(socialLinks).set(body).where(eq(socialLinks.id, 9)).returning();
        console.log("Update API logic success:", data);
    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
}
test();
