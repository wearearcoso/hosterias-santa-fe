const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ESTABLISHMENTS = [
  {
    slug: 'florida-tropical',
    name: 'Hostería Florida Tropical',
    websites: ['https://hosteriafloridatropical.com'],
    searchQuery: 'Hostería Florida Tropical Santa Fe de Antioquia fotos',
    instagram: 'hosteriafloridatropical'
  },
  {
    slug: 'mariscal-robledo',
    name: 'Hotel Mariscal Robledo',
    websites: ['https://www.hotelmariscalrobledo.com.co'],
    searchQuery: 'Hotel Mariscal Robledo Santa Fe de Antioquia fotos',
    instagram: 'hotelmariscalrobledo'
  },
  {
    slug: 'porton-del-sol',
    name: 'Hotel Portón del Sol',
    websites: ['https://www.hotelportondelsol.com'],
    searchQuery: 'Hotel Portón del Sol Santa Fe de Antioquia fotos',
    instagram: null
  },
  {
    slug: 'sancol',
    name: 'Hotel Spa Santa Fe Colonial',
    websites: ['https://santafecolonial.com'],
    searchQuery: 'Hotel y Spa Santa Fe Colonial SanCOL fotos',
    instagram: null
  },
  {
    slug: 'ivanna',
    name: 'Ivanna Hotel Campestre',
    websites: [],
    searchQuery: 'Ivanna Hotel Campestre Santa Fe de Antioquia fotos',
    instagram: null
  },
  {
    slug: 'fundadores',
    name: 'Hostería Fundadores',
    websites: [],
    searchQuery: 'Hostería Fundadores Santa Fe de Antioquia fotos',
    instagram: null
  },
  {
    slug: 'real',
    name: 'Hostería Real',
    websites: [],
    searchQuery: 'Hostería Real Santa Fe de Antioquia fotos',
    instagram: null
  },
  {
    slug: 'bohios',
    name: 'Hostería Bohíos Bar',
    websites: [],
    searchQuery: 'Hostería Bohíos Bar Santa Fe de Antioquia fotos',
    instagram: null
  },
  {
    slug: 'castellano',
    name: 'Hostería El Castellano',
    websites: [],
    searchQuery: 'Hostería El Castellano Santa Fe de Antioquia fotos',
    instagram: null
  },
  {
    slug: 'paraiso',
    name: 'Hostería Paraíso de Santa Fe',
    websites: [],
    searchQuery: 'Hostería Paraíso de Santa Fe Antioquia fotos',
    instagram: null
  },
  {
    slug: 'palser',
    name: 'Finca Hotel Tropical PalSer',
    websites: [],
    searchQuery: 'Finca Hotel Tropical PalSer Santa Fe de Antioquia fotos',
    instagram: null
  },
  {
    slug: 'santa-fe-parque',
    name: 'Hotel Santa Fe del Parque',
    websites: [],
    searchQuery: 'Hotel Santa Fe del Parque Antioquia fotos',
    instagram: null
  },
  {
    slug: 'santa-barbara',
    name: 'Hotel Santa Barbara Colonial',
    websites: [],
    searchQuery: 'Hotel Santa Barbara Colonial Santa Fe de Antioquia fotos',
    instagram: null
  },
  {
    slug: 'iguana',
    name: 'Hotel La Iguana',
    websites: [],
    searchQuery: 'Hotel La Iguana Santa Fe de Antioquia fotos',
    instagram: null
  },
  {
    slug: 'guaracu',
    name: 'Casa Hotel Guaracú',
    websites: ['https://www.casahotelguaracu.com'],
    searchQuery: 'Casa Hotel Guaracú Santa Fe de Antioquia fotos',
    instagram: null
  },
  {
    slug: 'nueva-granada',
    name: 'Nueva Granada Hotel Colonial',
    websites: [],
    searchQuery: 'Nueva Granada Hotel Colonial Santa Fe de Antioquia fotos',
    instagram: null
  },
  {
    slug: 'selva-maria',
    name: 'Selva María Hotel Boutique',
    websites: [],
    searchQuery: 'Selva María Hotel Boutique Santa Fe de Antioquia fotos',
    instagram: null
  }
];

const IMAGES_DIR = path.join(__dirname, '..', 'assets', 'images');
const SCRIPT = path.join(__dirname, 'process-images.sh');

async function scrapeWebsite(page, url, slug) {
  console.log(`  🌐 Visiting: ${url}`);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);

    const images = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      return Array.from(imgs)
        .map(img => img.src)
        .filter(src => src && (src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png') || src.includes('.webp')))
        .filter(src => !src.includes('icon') && !src.includes('logo') && !src.includes('avatar'))
        .slice(0, 5);
    });

    console.log(`  📸 Found ${images.length} images`);
    return images;
  } catch (e) {
    console.log(`  ⚠️ Failed: ${e.message}`);
    return [];
  }
}

async function scrapeInstagram(page, username, slug) {
  const url = `https://www.instagram.com/${username}/`;
  console.log(`  📱 Instagram: ${url}`);

  // Try public Instagram page
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(3000);

    const images = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      return Array.from(imgs)
        .map(img => img.src)
        .filter(src => src && src.startsWith('https://') && (src.includes('cdninstagram') || src.includes('fbcdn')))
        .slice(0, 4);
    });

    console.log(`  📸 Instagram: ${images.length} images`);
    return images;
  } catch (e) {
    console.log(`  ⚠️ Instagram failed: ${e.message}`);
    return [];
  }
}

async function scrapeDuckDuckGoImages(page, query, slug) {
  const url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;
  console.log(`  🔍 Searching: DuckDuckGo`);

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);

    // Click on some image tiles to get full-res versions
    const images = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img.tile--img__img');
      return Array.from(imgs)
        .map(img => img.src)
        .filter(src => src && src.startsWith('https://'))
        .slice(0, 5);
    });

    console.log(`  📸 DuckDuckGo: ${images.length} images`);
    return images;
  } catch (e) {
    console.log(`  ⚠️ Search failed: ${e.message}`);
    return [];
  }
}

async function processImage(url, slug, index) {
  const name = `${slug}-${String(index + 1).padStart(2, '0')}`;
  const outputPath = path.join(IMAGES_DIR, `${name}.webp`);

  if (fs.existsSync(outputPath)) {
    console.log(`  ⏭️ Already exists: ${name}.webp`);
    return;
  }

  try {
    execSync(`bash "${SCRIPT}" "${url}" "${name}" 800`, {
      timeout: 60000,
      stdio: 'pipe'
    });
  } catch (e) {
    console.log(`  ❌ Process failed for ${name}`);
  }
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const est of ESTABLISHMENTS) {
    console.log(`\n🏨 ${est.name} (${est.slug})`);
    const allImages = [];

    // Try official websites first
    for (const website of est.websites) {
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
      });
      const page = await context.newPage();
      const images = await scrapeWebsite(page, website, est.slug);
      allImages.push(...images);
      await context.close();
    }

    // Try Instagram if available
    if (est.instagram && allImages.length < 5) {
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
      });
      const page = await context.newPage();
      const images = await scrapeInstagram(page, est.instagram, est.slug);
      allImages.push(...images);
      await context.close();
    }

    // Fallback to image search
    if (allImages.length < 3) {
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
      });
      const page = await context.newPage();
      const images = await scrapeDuckDuckGoImages(page, est.searchQuery, est.slug);
      allImages.push(...images);
      await context.close();
    }

    // Deduplicate and process
    const uniqueImages = [...new Set(allImages)].slice(0, 5);
    console.log(`  🎯 Total unique: ${uniqueImages.length}`);

    for (let i = 0; i < uniqueImages.length; i++) {
      await processImage(uniqueImages[i], est.slug, i);
    }

    // Rate limit between establishments
    await new Promise(r => setTimeout(r, 2000));
  }

  await browser.close();

  // Summary
  console.log('\n\n=== 📊 FINAL SUMMARY ===');
  const files = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.webp') && !f.startsWith('tonusco-'));
  console.log(`Total new images: ${files.length}`);
  files.forEach(f => {
    const stat = fs.statSync(path.join(IMAGES_DIR, f));
    console.log(`  ${f} — ${(stat.size / 1024).toFixed(0)}KB`);
  });
}

main().catch(console.error);
