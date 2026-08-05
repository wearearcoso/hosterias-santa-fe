const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TARGETS = [
  { slug: 'mariscal-robledo', query: 'Hotel Mariscal Robledo Santa Fe de Antioquia piscina colonial', need: 3 },
  { slug: 'porton-del-sol', query: 'Hotel Porton del Sol Santa Fe de Antioquia', need: 1 },
  { slug: 'florida-tropical', query: 'Hostería Florida Tropical Santa Fe de Antioquia lago piscina', need: 2 },
  { slug: 'sancol', query: 'Hotel Spa Santa Fe Colonial Antioquia piscina', need: 1 },
  { slug: 'selva-maria', query: 'Selva Maria Hotel Boutique Santa Fe Antioquia', need: 1 },
  { slug: 'guaracu', query: 'Casa Hotel Guaracu Santa Fe de Antioquia', need: 1 },
];

const IMAGES_DIR = path.join(__dirname, '..', 'assets', 'images');
const SCRIPT = path.join(__dirname, 'process-images.sh');

async function scrapeGoogleImages(browser, query, slug) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&tbs=isz:l`;
  console.log(`  🔍 Google Images: ${query.substring(0, 60)}...`);

  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 }
  });
  const page = await ctx.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);

    // Scroll to load more images
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 400));
      await page.waitForTimeout(800);
    }

    // Click on first few images to get high-res versions
    const thumbs = await page.$$('img.rg_i');
    const highResUrls = [];
    
    for (let i = 0; i < Math.min(8, thumbs.length); i++) {
      try {
        await thumbs[i].click();
        await page.waitForTimeout(1500);
        
        // Get the high-res image URL from the side panel
        const hrImg = await page.$('img.sFlh5c, img.iPVvYb, img.n3VNCb');
        if (hrImg) {
          const src = await hrImg.getAttribute('src');
          if (src && src.startsWith('http') && !src.includes('gstatic') && (src.includes('jpg') || src.includes('png') || src.includes('webp'))) {
            highResUrls.push(src);
            if (highResUrls.length >= 5) break;
          }
        }
      } catch (e) {}
    }

    console.log(`  📸 Got ${highResUrls.length} high-res images`);
    await ctx.close();
    return highResUrls;
  } catch (e) {
    console.log(`  ⚠️ Failed: ${e.message}`);
    await ctx.close();
    return [];
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

  for (const target of TARGETS) {
    const images = await scrapeGoogleImages(browser, target.query, target.slug);
    if (images.length === 0) continue;

    const existing = fs.readdirSync(IMAGES_DIR).filter(f => f.startsWith(target.slug + '-'));
    let idx = existing.length + 1;

    for (const url of images.slice(0, 5)) {
      const name = `${target.slug}-${String(idx).padStart(2, '0')}`;
      idx++;
      try {
        execSync(`bash "${SCRIPT}" "${url}" "${name}" 1200`, { timeout: 90000, stdio: 'pipe' });
        const outPath = path.join(IMAGES_DIR, `${name}.webp`);
        if (fs.existsSync(outPath)) {
          const size = fs.statSync(outPath).size;
          console.log(`  ✅ ${name}.webp (${(size/1024).toFixed(0)}KB)`);
        }
      } catch (e) {
        console.log(`  ❌ Failed ${name}: ${e.message}`);
      }
    }

    await new Promise(r => setTimeout(r, 3000));
  }

  await browser.close();
  console.log('\nDone.');
}

main().catch(console.error);
