const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const NUEVOS = [
  { slug: 'fundadores-oficial', name: 'Hostería Fundadores', url: 'https://hosteriafundadores.com/', type: 'hosteria' },
  { slug: 'paraiso-oficial', name: 'Hostería Paraíso de Santa Fe', url: 'https://www.hosteriaparaisodesantafe.com/', type: 'hosteria' },
  { slug: 'porton-del-sol-oficial', name: 'Hotel Portón del Sol', url: 'https://www.hotelportondelsol.com.co/', type: 'hotel' },
  { slug: 'plaza-menor', name: 'Hostería de la Plaza Menor', url: 'https://hosteriadelaplazamenor.com/', type: 'hosteria' },
  { slug: 'real-oficial', name: 'Hostería Real', url: 'https://hosteriareal.com/', type: 'hosteria' },
  { slug: 'arena', name: 'Hotel Arena Santa Fe', url: 'https://bernalohotels.com/hotel-arena-santa-fe-de-antioquia/', type: 'hotel' },
  { slug: 'angel', name: 'Hotel Ángel', url: 'https://bernalohotels.com/hotel-angel/', type: 'hotel' },
  { slug: 'iguana-oficial', name: 'Hotel La Iguana', url: 'https://bernalohotels.com/hotel-iguana/', type: 'hotel' },
  { slug: 'mariscal-oficial', name: 'Hotel Mariscal Robledo', url: 'https://www.hotelmariscalrobledo.com/es/index.html', type: 'hotel' },
  { slug: 'santa-fe-colonial-real', name: 'Hotel Spa Santa Fe Colonial', url: 'https://hotelspasantafecolonial.com/', type: 'hosteria' },
  { slug: 'villa-del-marques', name: 'Hotel Villa del Marqués', url: 'https://www.hotelvilladelmarques.com/', type: 'hotel' },
  { slug: 'casa-bixa', name: 'Hotel Boutique Casa Bixa', url: 'https://hotelesmemorables.com/es/hotel-boutique-casa-bixa/', type: 'hotel' },
  { slug: 'entre-palmas', name: 'Entre Palmas Casa Hotel', url: 'https://www.entrepalmascasahotel.com/', type: 'hotel' },
  { slug: 'caserón-del-parque', name: 'Hotel Caserón del Parque', url: 'https://www.caserondelparque.com/', type: 'hotel' },
  { slug: 'casa-de-verano', name: 'Casa de Verano', url: 'https://casadeverano.com.co/', type: 'hotel' },
  { slug: 'campestre-real', name: 'Hotel Campestre Real', url: 'https://hotelcampestrereal.com/', type: 'hotel' },
  { slug: 'santa-maria-villa', name: 'Santa María Villa', url: 'https://santamaria.villa.family/', type: 'hosteria' },
];

const IMAGES_DIR = path.join(__dirname, '..', 'assets', 'images');

async function scrapeSite(browser, target) {
  console.log(`\n🏨 ${target.name} → ${target.url}`);
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    viewport: { width: 1280, height: 900 }
  });
  const page = await ctx.newPage();

  try {
    await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);

    // Extract text info
    const info = await page.evaluate(() => {
      const body = document.body?.innerText || '';
      // Try to find price info
      const priceMatch = body.match(/\$[\d.,]+/g) || [];
      const desc = body.substring(0, 500);
      // Get all images
      const imgs = Array.from(document.querySelectorAll('img'))
        .map(i => i.src)
        .filter(s => s && s.startsWith('http') && !s.includes('logo') && !s.includes('icon') && !s.includes('avatar'))
        .filter(s => /\.(jpg|jpeg|png|webp)/i.test(s.split('?')[0]))
        .slice(0, 6);
      return { prices: [...new Set(priceMatch)].slice(0, 3), desc, images: imgs };
    });

    console.log(`  💰 ${info.prices.join(', ') || 'no prices found'}`);
    console.log(`  📸 ${info.images.length} images`);

    // Download images
    const outDir = path.join(IMAGES_DIR, target.slug);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const downloaded = [];
    for (let i = 0; i < Math.min(info.images.length, 5); i++) {
      try {
        const imgUrl = info.images[i];
        const ext = imgUrl.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
        const outPath = path.join(outDir, `${target.slug}-${i+1}.${ext}`);
        execSync(`curl -sSL --max-time 20 -o "${outPath}" "${imgUrl}"`, { stdio: 'pipe' });
        const size = fs.statSync(outPath).size;
        if (size > 2000) {
          downloaded.push(outPath);
          console.log(`    ✅ ${path.basename(outPath)} (${(size/1024).toFixed(0)}KB)`);
        } else {
          fs.unlinkSync(outPath);
        }
      } catch (e) {}
    }

    await ctx.close();
    return { ...info, images: downloaded, slug: target.slug, name: target.name, type: target.type, url: target.url };
  } catch (e) {
    console.log(`  ⚠️ Failed: ${e.message.substring(0, 80)}`);
    await ctx.close();
    return null;
  }
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const results = [];

  for (const target of NUEVOS) {
    const result = await scrapeSite(browser, target);
    if (result) results.push(result);
    await new Promise(r => setTimeout(r, 2000));
  }

  await browser.close();

  // Write results summary
  const summary = results.map(r => ({
    slug: r.slug, name: r.name, type: r.type, url: r.url,
    prices: r.prices, images: r.images.length,
    description: r.desc.substring(0, 200)
  }));

  const outPath = path.join(__dirname, '..', 'new-establishments.json');
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
  console.log(`\n\n📊 Summary saved to new-establishments.json`);
  console.log(`Total scraped: ${results.length}/${NUEVOS.length}`);
}

main().catch(console.error);
