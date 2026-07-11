const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 8766;
const HOST = '127.0.0.1';

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
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  
  async function inspectPage(page, name) {
    await page.goto(`http://${HOST}:${PORT}/`);
    await page.waitForTimeout(2500);
    
    const data = await page.evaluate(() => {
      const getBox = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height, text: el.textContent.trim().substring(0, 50) };
      };
      
      const getBoxes = (sel) => {
        return Array.from(document.querySelectorAll(sel)).map((el, i) => {
          const r = el.getBoundingClientRect();
          return { index: i, x: r.x, y: r.y, width: r.width, height: r.height, text: el.textContent.trim().substring(0, 60) };
        });
      };
      
      // Check for overflow
      const overflows = [];
      document.querySelectorAll('h1, h2, h3, h4, .btn, .nav__link, .service-card__title, .equipment-card__title, .project-card__title').forEach(el => {
        if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) {
          const r = el.getBoundingClientRect();
          overflows.push({
            tag: el.tagName,
            class: el.className,
            text: el.textContent.trim().substring(0, 60),
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
            scrollHeight: el.scrollHeight,
            clientHeight: el.clientHeight,
            y: r.y + window.scrollY
          });
        }
      });
      
      return {
        pageHeight: document.documentElement.scrollHeight,
        nav: getBox('#nav'),
        heroTitle: getBox('.hero__title'),
        heroSubtitle: getBox('.hero__subtitle'),
        marquee: getBox('.marquee'),
        marqueeTracks: getBoxes('.marquee__track'),
        navLinks: getBoxes('.nav__link'),
        navBtn: getBox('.nav__actions .btn'),
        serviceCards: getBoxes('.service-card__title'),
        equipmentCards: getBoxes('.equipment-card__title'),
        projectCards: getBoxes('.project-card__title'),
        ctaTitle: getBox('.cta__title'),
        footer: getBox('.footer'),
        overflows: overflows
      };
    });
    
    fs.writeFileSync(`/Users/namoneo/develop/bestmetall/inspect-${name}.json`, JSON.stringify(data, null, 2));
    console.log(`Inspected ${name}: pageHeight=${data.pageHeight}, overflows=${data.overflows.length}`);
    return data;
  }
  
  const pageRu = await context.newPage();
  const dataRu = await inspectPage(pageRu, 'ru');
  
  const pageUz = await context.newPage();
  await pageUz.goto(`http://${HOST}:${PORT}/`);
  await pageUz.click('#langToggle');
  await pageUz.waitForTimeout(2500);
  const dataUz = await inspectPage(pageUz, 'uz');
  
  await browser.close();
  server.close();
  
  // Compare
  console.log('\n--- COMPARISON ---');
  console.log(`RU page height: ${dataRu.pageHeight}`);
  console.log(`UZ page height: ${dataUz.pageHeight}`);
  console.log(`Difference: ${Math.abs(dataRu.pageHeight - dataUz.pageHeight)}px`);
  
  console.log('\n--- OVERFLOWS ---');
  console.log('RU overflows:', dataRu.overflows.map(o => `${o.class} "${o.text}" (${o.scrollWidth}x${o.scrollHeight} vs ${o.clientWidth}x${o.clientHeight})`));
  console.log('UZ overflows:', dataUz.overflows.map(o => `${o.class} "${o.text}" (${o.scrollWidth}x${o.scrollHeight} vs ${o.clientWidth}x${o.clientHeight})`));
  
  console.log('\n--- MARQUEE TRACKS ---');
  console.log('RU tracks:', dataRu.marqueeTracks.map(t => ({ w: t.width, text: t.text.substring(0, 30) })));
  console.log('UZ tracks:', dataUz.marqueeTracks.map(t => ({ w: t.width, text: t.text.substring(0, 30) })));
  
  console.log('\n--- NAV LINKS ---');
  console.log('RU:', dataRu.navLinks.map(l => `${l.width.toFixed(0)}px "${l.text}"`));
  console.log('UZ:', dataUz.navLinks.map(l => `${l.width.toFixed(0)}px "${l.text}"`));
});
