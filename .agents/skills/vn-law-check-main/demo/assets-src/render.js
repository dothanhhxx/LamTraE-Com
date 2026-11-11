// Render ảnh demo và social preview từ HTML.  node demo/assets-src/render.js
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const dir = __dirname;

  const demo = await browser.newPage({ viewport: { width: 1400, height: 800 }, deviceScaleFactor: 2 });
  await demo.goto('file://' + path.join(dir, 'demo.html'));
  await demo.screenshot({ path: path.join(dir, '..', 'demo.png'), fullPage: true });

  const social = await browser.newPage({ viewport: { width: 1280, height: 640 }, deviceScaleFactor: 1 });
  await social.goto('file://' + path.join(dir, 'social.html'));
  await social.screenshot({ path: path.join(dir, '..', 'social-preview.png') });

  await browser.close();
})();
