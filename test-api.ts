import { db } from './src/db/index.ts';
import { socialLinks } from './src/db/schema.ts';
import { eq } from 'drizzle-orm';

async function test() {
    try {
        const body = {
            platform: 'test2',
            url: 'http://test2.com',
            icon: 'link',
            visible: true,
            orderIndex: 0
        };
        const data = await db.insert(socialLinks).values(body).returning();
        console.log("Insert API logic success:", data);
    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
}
test();
