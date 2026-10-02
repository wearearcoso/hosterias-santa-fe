import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const viewports = [{ width: 1440, height: 900 }, { width: 768, height: 1024 }];
const slugs = ['hosteria-florida-tropical', 'hosteria-fundadores', 'hotel-mariscal-robledo', 'hotel-porton-del-sol', 'hotel-la-iguana'];
await fs.mkdir('docs/screenshots', { recursive: true });
const browser = await chromium.launch({ headless: true });
let failed = false;

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    const response = await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
    await page.waitForFunction(() => [...document.images].every(image => image.complete));
    const state = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth,
      headingCount: document.querySelectorAll('h1').length,
      images: [...document.images].map(image => ({ src: image.getAttribute('src'), width: image.naturalWidth })),
      cards: [...document.querySelectorAll('.property-card')].map(card => card.dataset.propertySlug),
      cardLinks: [...document.querySelectorAll('.property-card a[href]')].map(link => link.getAttribute('href'))
    }));
    await page.screenshot({ path: `docs/screenshots/home-${viewport.width}x${viewport.height}.png`, fullPage: true });
    await page.locator('.site-menu summary').click();
    const menuOpens = await page.locator('.site-menu nav').isVisible();
    await page.locator('.site-menu summary').click();
    await page.locator('.header-cta').click();
    const wizardOpens = await page.locator('#leadWizard').isVisible();
    await page.keyboard.press('Escape');
    const wizardCloses = !(await page.locator('#leadWizard').isVisible());
    const checks = {
      httpOk: response?.status() === 200,
      noHorizontalOverflow: state.scrollWidth <= state.innerWidth,
      oneHeading: state.headingCount === 1,
      fiveApprovedCards: JSON.stringify(state.cards) === JSON.stringify(slugs),
      fiveWorkingCardLinks: state.cardLinks.length === 5 && state.cardLinks.every(link => slugs.some(slug => link === `/${slug}`)),
      imagesLoaded: state.images.every(image => image.width > 0),
      menuOpens,
      wizardOpens,
      wizardCloses,
      noRuntimeErrors: errors.length === 0
    };
    console.log(JSON.stringify({ viewport, checks, details: { errors, scrollWidth: state.scrollWidth, images: state.images } }, null, 2));
    if (Object.values(checks).includes(false)) failed = true;
    await page.close();
  }
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    for (const slug of slugs) {
      const response = await page.goto(`${base}/${slug}.html`, { waitUntil: 'networkidle' });
      const state = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth,
        headingCount: document.querySelectorAll('h1').length,
        imageLoaded: [...document.images].every(image => image.complete && image.naturalWidth > 0),
        backLink: Boolean(document.querySelector('a[href="/"]'))
      }));
      await page.locator('[data-lw-open]').first().click();
      const wizardOpens = await page.locator('#leadWizard').isVisible();
      const checks = {
        httpOk: response?.status() === 200,
        noHorizontalOverflow: state.scrollWidth <= state.innerWidth,
        oneHeading: state.headingCount === 1,
        imageLoaded: state.imageLoaded,
        backLink: state.backLink,
        wizardOpens
      };
      console.log(JSON.stringify({ route: slug, width, checks }));
      if (Object.values(checks).includes(false)) failed = true;
    }
    await page.close();
  }
} finally {
  await browser.close();
}
if (failed) process.exit(1);
