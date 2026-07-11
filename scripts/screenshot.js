const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 8765;
const HOST = '127.0.0.1';

// Simple static file server
const server = http.createServer((req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(__dirname, '..', url.split('?')[0]);
  const ext = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.svg': 'image/svg+xml',
  };
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, HOST, async () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
  
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  
  // Screenshot Russian
  const pageRu = await context.newPage();
  await pageRu.goto(`http://${HOST}:${PORT}/`);
  await pageRu.waitForTimeout(2000); // wait for animations/fonts
  await pageRu.screenshot({ path: '/Users/namoneo/develop/bestmetall/screenshot-ru.png', fullPage: true });
  console.log('Russian screenshot saved');
  
  // Screenshot Uzbek
  const pageUz = await context.newPage();
  await pageUz.goto(`http://${HOST}:${PORT}/`);
  // Click language toggle to switch to Uzbek
  await pageUz.click('#langToggle');
  await pageUz.waitForTimeout(2000);
  await pageUz.screenshot({ path: '/Users/namoneo/develop/bestmetall/screenshot-uz.png', fullPage: true });
  console.log('Uzbek screenshot saved');
  
  await browser.close();
  server.close();
  console.log('Done');
});
