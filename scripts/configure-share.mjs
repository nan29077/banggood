import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const pagePath = fileURLToPath(new URL('../dist/index.html', import.meta.url));
const imagePath = '/assets/brand/banggeut-share-v1.png';

export function configureShareMetadata(html, siteUrl) {
  const url = new URL(siteUrl);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('Use the public HTTPS site origin only, for example https://your-domain.example');
  }
  const site = url.origin + '/';
  const image = new URL(imagePath, site).href;
  // Strip an earlier publication origin so configuring the same site is repeatable.
  html = html.replace(/<meta property="og:url" content="[^"]*">\s*/g, '')
    .replace(/<link rel="canonical" href="[^"]*">\s*/g, '');
  for (const key of ['og:image', 'twitter:image']) {
    const attribute = key.startsWith('og:') ? 'property' : 'name';
    const pattern = new RegExp(`<meta ${attribute}="${key}" content="[^"]*">`, 'g');
    if ([...html.matchAll(pattern)].length !== 1) throw new Error(`Expected one ${key} tag`);
    html = html.replace(pattern, `<meta ${attribute}="${key}" content="${image}">`);
  }
  return html.replace('</head>', `<meta property="og:url" content="${site}">\n<link rel="canonical" href="${site}">\n</head>`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 3) throw new Error('Usage: npm run share:configure -- https://your-domain.example');
    const html = await readFile(pagePath, 'utf8');
    await writeFile(pagePath, configureShareMetadata(html, process.argv[2]));
    console.log('Updated sharing image URLs, og:url and canonical. Deploy dist/ to the same public origin.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
