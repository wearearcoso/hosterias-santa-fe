const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ESTABLISHMENTS = [
  { slug: 'mariscal-robledo', name: 'Hotel Mariscal Robledo', bookingSearch: 'mariscal-robledo-santa-fe-de-antioquia', bingQuery: 'Hotel Mariscal Robledo Santa Fe de Antioquia piscina' },
  { slug: 'porton-del-sol', name: 'Hotel Portón del Sol', bookingSearch: 'porton-del-sol-santa-fe-de-antioquia', bingQuery: 'Hotel Portón del Sol Santa Fe de Antioquia piscina' },
  { slug: 'sancol', name: 'Hotel Spa Santa Fe Colonial', bookingSearch: 'santa-fe-colonial', bingQuery: 'Hotel Spa Santa Fe Colonial SanCOL Antioquia piscina' },
  { slug: 'ivanna', name: 'Ivanna Hotel Campestre', bookingSearch: 'ivanna-hotel-campestre', bingQuery: 'Ivanna Hotel Campestre Santa Fe de Antioquia piscina' },
  { slug: 'fundadores', name: 'Hostería Fundadores', bookingSearch: null, bingQuery: 'Hostería Fundadores Santa Fe de Antioquia' },
  { slug: 'real', name: 'Hostería Real', bookingSearch: null, bingQuery: 'Hostería Real Santa Fe de Antioquia piscina' },
  { slug: 'bohios', name: 'Hostería Bohíos Bar', bookingSearch: null, bingQuery: 'Hostería Bohíos Bar Santa Fe de Antioquia' },
  { slug: 'castellano', name: 'Hostería El Castellano', bookingSearch: null, bingQuery: 'Hostería El Castellano Santa Fe de Antioquia' },
  { slug: 'paraiso', name: 'Hostería Paraíso Santa Fe', bookingSearch: null, bingQuery: 'Hostería Paraíso de Santa Fe Antioquia' },
  { slug: 'palser', name: 'Finca Hotel Tropical PalSer', bookingSearch: null, bingQuery: 'Finca Hotel Tropical PalSer Santa Fe de Antioquia' },
  { slug: 'santa-fe-parque', name: 'Hotel Santa Fe del Parque', bookingSearch: null, bingQuery: 'Hotel Santa Fe del Parque Antioquia centro' },
  { slug: 'santa-barbara', name: 'Hotel Santa Barbara Colonial', bookingSearch: null, bingQuery: 'Hotel Santa Barbara Colonial Santa Fe de Antioquia' },
  { slug: 'iguana', name: 'Hotel La Iguana', bookingSearch: null, bingQuery: 'Hotel La Iguana Santa Fe de Antioquia' },
  { slug: 'guaracu', name: 'Casa Hotel Guaracú', bookingSearch: null, bingQuery: 'Casa Hotel Guaracú Santa Fe de Antioquia' },
  { slug: 'nueva-granada', name: 'Nueva Granada Hotel Colonial', bookingSearch: null, bingQuery: 'Nueva Granada Hotel Colonial Santa Fe de Antioquia' },
  { slug: 'selva-maria', name: 'Selva María Hotel Boutique', bookingSearch: null, bingQuery: 'Selva María Hotel Boutique Santa Fe de Antioquia' },
  { slug: 'florida-tropical', name: 'Hostería Florida Tropical', bookingSearch: null, bingQuery: 'Hostería Florida Tropical Santa Fe de Antioquia lago piscina', skipWebsite: true },
];

const IMAGES_DIR = path.join(__dirname, '..', 'assets', 'images');
const SCRIPT = path.join(__dirname, 'process-images.sh');

async function scrapeBingImages(page, query, slug) {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&qft=+filterui:imagesize-large&form=IRFLTR`;
  console.log(`  🔍 Bing: ${url.substring(0, 90)}...`);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);

    // Scroll to load more images
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 400));
      await page.waitForTimeout(1000);
    }

    const images = await page.evaluate(() => {
      const imgs = document.querySelectorAll('.mimg');
      return Array.from(imgs)
        .map(img => img.src || img.getAttribute('data-src'))
        .filter(src => src && src.startsWith('http') && !src.includes('data:image'))
        .slice(0, 6);
    });

    console.log(`  📸 Bing: ${images.length} images`);
    return images;
  } catch (e) {
    console.log(`  ⚠️ Bing failed: ${e.message}`);
    return [];
  }
}

async function scrapeBooking(page, searchName, slug) {
  if (!searchName) return [];
  const url = `https://www.booking.com/hotel/co/${searchName}.es.html`;
  console.log(`  🏨 Booking: ${url}`);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);

    const images = await page.evaluate(() => {
      const allImgs = document.querySelectorAll('img');
      return Array.from(allImgs)
        .map(img => img.src)
        .filter(src => src && src.startsWith('https://') && (src.includes('bstatic') || src.includes('booking')))
        .filter(src => !src.includes('flag') && !src.includes('icon') && !src.includes('logo'))
        .slice(0, 5);
    });

    console.log(`  📸 Booking: ${images.length} images`);
    return images;
  } catch (e) {
    console.log(`  ⚠️ Booking failed: ${e.message}`);
    return [];
  }
}

async function scrapeGoogleMaps(page, name, slug) {
  const url = `https://www.google.com/maps/search/${encodeURIComponent(name + ' Santa Fe de Antioquia')}`;
  console.log(`  🗺️ Maps: searching...`);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(4000);

    // Click on the first photo if visible
    const images = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      return Array.from(imgs)
        .map(img => img.src)
        .filter(src => src && src.startsWith('https://') && (src.includes('googleusercontent') || src.includes('ggpht')))
        .filter(src => !src.includes('favicon') && !src.includes('s96'))
        .slice(0, 4);
    });

    console.log(`  📸 Maps: ${images.length} images`);
    return images;
  } catch (e) {
    console.log(`  ⚠️ Maps failed: ${e.message}`);
    return [];
  }
}

async function processImage(url, slug, index) {
  const name = `${slug}-${String(index + 1).padStart(2, '0')}`;
  const outputPath = path.join(IMAGES_DIR, `${name}.webp`);

  if (fs.existsSync(outputPath)) {
    // Check if under 90KB
    const stat = fs.statSync(outputPath);
    if (stat.size < 92 * 1024) {
      console.log(`  ⏭️ Already valid: ${name}.webp (${(stat.size/1024).toFixed(0)}KB)`);
      return;
    }
  }

  try {
    execSync(`bash "${SCRIPT}" "${url}" "${name}" 800`, {
      timeout: 60000,
      stdio: 'pipe'
    });
  } catch (e) {
    console.log(`  ❌ Failed: ${name}`);
  }
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  for (const est of ESTABLISHMENTS) {
    console.log(`\n🏨 ${est.name} (${est.slug})`);
    const allImages = [];

    // Skip website step for establishments that already have images
    if (!est.skipWebsite) {
      // Try Booking.com
      const ctx1 = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 900 }
      });
      const pg1 = await ctx1.newPage();
      const bookingImgs = await scrapeBooking(pg1, est.bookingSearch, est.slug);
      allImages.push(...bookingImgs);
      await ctx1.close();
    }

    // Bing Images (most reliable)
    if (allImages.length < 5) {
      const ctx2 = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 900 }
      });
      const pg2 = await ctx2.newPage();
      const bingImgs = await scrapeBingImages(pg2, est.bingQuery, est.slug);
      allImages.push(...bingImgs);
      await ctx2.close();
    }

    // Google Maps as last resort
    if (allImages.length < 3) {
      const ctx3 = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 900 }
      });
      const pg3 = await ctx3.newPage();
      const mapsImgs = await scrapeGoogleMaps(pg3, est.name, est.slug);
      allImages.push(...mapsImgs);
      await ctx3.close();
    }

    const unique = [...new Set(allImages)].slice(0, 5);
    console.log(`  🎯 Processing ${unique.length} images`);

    for (let i = 0; i < unique.length; i++) {
      await processImage(unique[i], est.slug, i);
    }

    await new Promise(r => setTimeout(r, 1500));
  }

  await browser.close();

  console.log('\n\n=== 📊 RESULTS ===');
  const files = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.webp'));
  const bySlug = {};
  files.forEach(f => {
    const slug = f.replace(/-\d+\.webp$/, '').replace('-social', '');
    if (!bySlug[slug]) bySlug[slug] = [];
    bySlug[slug].push(f);
  });
  Object.entries(bySlug).sort().forEach(([slug, imgs]) => {
    console.log(`\n${slug}: ${imgs.length} images`);
    imgs.forEach(f => {
      const stat = fs.statSync(path.join(IMAGES_DIR, f));
      console.log(`  ${f} — ${(stat.size/1024).toFixed(0)}KB`);
    });
  });
}

main().catch(console.error);
