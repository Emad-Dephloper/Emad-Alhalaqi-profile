const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/analytics',
  method: 'GET',
};

// We don't have authentication for curl right now.
// It will probably give 401 Unauthorized because of requireAuth
