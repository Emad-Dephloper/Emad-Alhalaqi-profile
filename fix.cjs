const fs = require('fs');
let content = fs.readFileSync('src/server/api.ts', 'utf8');
content = content.replace(
  'socialLinks, settings }',
  'socialLinks, settings, pageViews }'
);
fs.writeFileSync('src/server/api.ts', content);
