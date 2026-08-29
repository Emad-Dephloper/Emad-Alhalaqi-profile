import { fetchApi } from './src/lib/api.js';

// We can't use fetchApi directly here outside the browser, so let's just make http requests
const endpoints = ['/projects', '/posts', '/services', '/skills', '/experience', '/education', '/certificates', '/testimonials', '/settings', '/social-links'];

async function main() {
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`http://localhost:3000/api${endpoint}`);
      const text = await res.text();
      if (!res.ok) {
        console.error(`Error on ${endpoint}: ${res.status} ${text}`);
      } else {
        console.log(`Success on ${endpoint}: ${text.substring(0, 50)}...`);
      }
    } catch (e) {
      console.error(`Fetch failed on ${endpoint}:`, e);
    }
  }
}
main();
