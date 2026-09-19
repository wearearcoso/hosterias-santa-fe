import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const sizes = [{ width:390, height:844 }, { width:320, height:844 }];
await fs.mkdir('docs/screenshots', { recursive:true });
const browser = await chromium.launch({ headless:true });
let failed = false;
for (const viewport of sizes) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(base, { waitUntil:'networkidle' });
  const result = await page.evaluate(() => {
    const images = [...document.images].map(img => ({src:img.currentSrc,complete:img.complete,naturalWidth:img.naturalWidth}));
    const links = [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'));
    const cards = document.querySelectorAll('.property-card').length;
    const tapTargets = [...document.querySelectorAll('button')].filter(el => !el.closest('[hidden]')).map(el => ({text:el.textContent.trim(),height:el.getBoundingClientRect().height,width:el.getBoundingClientRect().width}));
    return { scrollWidth:document.documentElement.scrollWidth, innerWidth, scrollHeight:document.documentElement.scrollHeight, images, links, cards, smallTargets:tapTargets.filter(x => x.height < 44 || x.width < 44) };
  });
  await page.screenshot({ path:`docs/screenshots/home-${viewport.width}x${viewport.height}.png`, fullPage:true });
  await page.locator('[data-lw-open]').first().click();
  const wizardVisible = await page.locator('#leadWizard').isVisible();
  const checks = {
    noHorizontalOverflow: result.scrollWidth <= result.innerWidth,
    fiveCards: result.cards === 5,
    imagesLoaded: result.images.every(image => image.complete && image.naturalWidth > 0),
    linksSafe: result.links.every(link => !/^https?:\/\/wa\.me|573170000000/.test(link)),
    touchTargets: result.smallTargets.length === 0,
    wizardVisible,
    noRuntimeErrors: errors.length === 0,
    reasonableHeight: result.scrollHeight < 9000
  };
  console.log(JSON.stringify({ viewport, checks, details:{scrollWidth:result.scrollWidth,scrollHeight:result.scrollHeight,errors,smallTargets:result.smallTargets} }, null, 2));
  if (Object.values(checks).includes(false)) failed = true;
  await page.close();
}
await browser.close();
if (failed) process.exit(1);
