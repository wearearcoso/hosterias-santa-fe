const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TARGETS = [
  { slug: 'mariscal-robledo', url: 'https://www.booking.com/hotel/co/mariscal-robledo-santa-fe-de-antioquia.es.html', need: 4 },
  { slug: 'porton-del-sol', url: 'https://www.booking.com/hotel/co/hotel-porton-del-sol.es.html', need: 0 },
  { slug: 'sancol', url: 'https://www.booking.com/hotel/co/santa-fe-colonial.es.html', need: 0 },
  { slug: 'selva-maria', url: 'https://www.booking.com/hotel/co/selva-maria.es.html', need: 1 },
  { slug: 'guaracu', url: 'https://www.booking.com/hotel/co/casa-guaracu.es.html', need: 1 },
];

const IMAGES_DIR = path.join(__dirname, '..', 'assets', 'images');
const SCRIPT = path.join(__dirname, 'process-images.sh');

async function getBookingImages(browser, target) {
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 }
  });
  const page = await ctx.newPage();

  console.log(`\n🏨 ${target.slug}: ${target.url}`);

  try {
    await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(4000);

    // Click on photos to open gallery
    const photosBtn = await page.$('[data-testid="photos-view-all"], .bh-photo-grid-item, [aria-label*="foto"]');
    if (photosBtn) {
      await photosBtn.click();
      await page.waitForTimeout(2000);
    }

    // Scroll gallery
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(800);
    }

    const images = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      return Array.from(imgs)
        .map(img => img.src)
        .filter(src => src && src.startsWith('https://') && (src.includes('bstatic') || src.includes('booking') || src.includes('r-xx')))
        .filter(src => src.includes('max1024') || src.includes('max1280') || src.includes('max1920') || src.includes('original'))
        .slice(0, 6);
    });

    console.log(`  📸 Got ${images.length} high-res images`);
    await ctx.close();
    return images;
  } catch (e) {
    console.log(`  ⚠️ Failed: ${e.message}`);
    await ctx.close();
    return [];
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

  for (const target of TARGETS) {
    const images = await getBookingImages(browser, target);
    const unique = [...new Set(images)].slice(0, 5);

    // Start from the next available index
    const existing = fs.readdirSync(IMAGES_DIR).filter(f => f.startsWith(target.slug + '-'));
    let idx = existing.length + 1;

    for (const url of unique) {
      const name = `${target.slug}-${String(idx).padStart(2, '0')}`;
      idx++;
      try {
        execSync(`bash "${SCRIPT}" "${url}" "${name}" 800`, { timeout: 60000, stdio: 'pipe' });
        console.log(`  ✅ ${name}.webp`);
      } catch (e) {
        console.log(`  ❌ Failed: ${name}`);
      }
    }

    await new Promise(r => setTimeout(r, 2000));
  }

  await browser.close();
  console.log('\nDone.');
}

main().catch(console.error);
