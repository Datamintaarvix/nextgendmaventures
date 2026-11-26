
process.env.NODE_ENV = 'test';
const http = require('http');
const app = require('./server');

const testPort = 5988;
const server = app.listen(testPort, async () => {
  console.log('Testing app on port ' + testPort);

  const endpoints = [
    { url: '/', expectStatus: 200, expectType: 'text/html' },
    { url: '/admin', expectStatus: 200, expectType: 'text/html' },
    { url: '/logo.jpeg', expectStatus: 200, expectType: 'image/jpeg' },
    { url: '/h1.jpg', expectStatus: 200, expectType: 'image/jpeg' },
    { url: '/h2.jpg', expectStatus: 200, expectType: 'image/jpeg' },
    { url: '/sam.png', expectStatus: 200, expectType: 'image/png' },
    { url: '/vid1.mp4', expectStatus: 200, expectType: 'video/mp4' },
    // 7 Core disciplines
    { url: '/assets/Core_Disciplines/cloud-architect.jpg', expectStatus: 200, expectType: 'image/jpeg' },
    { url: '/assets/Core_Disciplines/fullstack-web.jpg', expectStatus: 200, expectType: 'image/jpeg' },
    { url: '/assets/Core_Disciplines/machine-learning.jpg', expectStatus: 200, expectType: 'image/jpeg' },
    { url: '/assets/Core_Disciplines/ui-ux-design.jpg', expectStatus: 200, expectType: 'image/jpeg' },
    { url: '/assets/Core_Disciplines/devops-cloud.jpg', expectStatus: 200, expectType: 'image/jpeg' },
    { url: '/assets/Core_Disciplines/data-analytics.jpg', expectStatus: 200, expectType: 'image/jpeg' },
    { url: '/assets/Core_Disciplines/cyber-defense.jpg', expectStatus: 200, expectType: 'image/jpeg' },
    // Course cards with spaces and ampersands
    { url: '/assets/home.images/home.images/Cloud%20%26%20DevOps.jpg', expectStatus: 200, expectType: 'image/jpeg' },
    { url: '/assets/home.images/home.images/Social%20%26%20Growth%20Marketing.jpg', expectStatus: 200, expectType: 'image/jpeg' },
    { url: '/assets/home.images/home.images/ai%20in%20automative%20head.png', expectStatus: 200, expectType: 'image/png' },
    { url: '/assets/home.images/home.images/industry%20robo.jpeg', expectStatus: 200, expectType: 'image/jpeg' },
    { url: '/assets/home.images/home.images/ev%20for%20mech.png', expectStatus: 200, expectType: 'image/png' },
    { url: '/assets/home.images/home.images/automotive%20cad%20using%20solid.jpeg', expectStatus: 200, expectType: 'image/jpeg' },
    { url: '/assets/home.images/home.images/automative%20trouble.jpeg', expectStatus: 200, expectType: 'image/jpeg' },
    { url: '/assets/home.images/home.images/vehicle%20dynamic.jpeg', expectStatus: 200, expectType: 'image/jpeg' },
    { url: '/assets/home.images/home.images/ai%20in%20automative.jpeg', expectStatus: 200, expectType: 'image/jpeg' },
    { url: '/assets/home.images/home.images/ev%20battery.png', expectStatus: 200, expectType: 'image/png' },
    // Missing asset check -> must return 404, not HTML index
    { url: '/assets/nonexistent-file.png', expectStatus: 404 },
    // API registration endpoint check
    { url: '/api/registrations', expectStatus: [200, 401] }
  ];

  let passed = 0;
  let failed = 0;

  for (const ep of endpoints) {
    try {
      const res = await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:' + testPort + ep.url, resolve).on('error', reject);
      });
      const ct = res.headers['content-type'] || '';
      const statusMatches = Array.isArray(ep.expectStatus) ? ep.expectStatus.includes(res.statusCode) : res.statusCode === ep.expectStatus;
      const typeMatches = !ep.expectType || ct.includes(ep.expectType);

      if (statusMatches && typeMatches) {
        console.log(`[PASS] ${ep.url} -> ${res.statusCode} (${ct})`);
        passed++;
      } else {
        console.error(`[FAIL] ${ep.url} -> Expected ${ep.expectStatus} (${ep.expectType || '*'}), Got ${res.statusCode} (${ct})`);
        failed++;
      }
    } catch (e) {
      console.error(`[ERROR] ${ep.url}:`, e.message);
      failed++;
    }
  }

  server.close(() => {
    console.log(`\n=== Test Summary: ${passed} Passed, ${failed} Failed ===`);
    process.exit(failed > 0 ? 1 : 0);
  });
});
