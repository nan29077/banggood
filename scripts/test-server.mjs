import assert from 'node:assert/strict';
import {createServer} from './dev-server.mjs';
import {configureShareMetadata} from './configure-share.mjs';
const server=createServer();
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
try {
  const page=await fetch(base);assert.equal(page.status,200);const html=await page.text();assert.match(html,/방긋/);
  // A link crawler reads the initial HTML without running the application scripts.
  const meta = name => new RegExp(`<meta (?:property|name)="${name}" content="([^"]*)">`).exec(html)?.[1];
  assert.equal(meta('og:type'),'website');assert.equal(meta('og:locale'),'ko_KR');
  assert.match(meta('og:title'),/좋은 물건의 다음 이야기, 함께 방긋\./);
  assert.equal(meta('twitter:card'),'summary_large_image');
  assert.equal(meta('og:title'),meta('twitter:title'));
  assert.equal(meta('og:description'),meta('twitter:description'));
  assert.ok(meta('og:image:alt'));assert.equal(meta('og:image'),meta('twitter:image'));
  const shareImageUrl=new URL(meta('og:image'),base);
  assert.ok(shareImageUrl.pathname.startsWith('/assets/'),'Sharing image must be a bundled asset');
  const shareImage=await fetch(new URL(shareImageUrl.pathname,base));
  assert.equal(shareImage.status,200);assert.equal(shareImage.headers.get('content-type'),'image/png');
  const png=Buffer.from(await shareImage.arrayBuffer());
  assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16),Number(meta('og:image:width')));
  assert.equal(png.readUInt32BE(20),Number(meta('og:image:height')));
  assert.ok(png.length<5*1024*1024);
  const published=configureShareMetadata(html,'https://market.example');
  assert.match(published,/<meta property="og:url" content="https:\/\/market\.example\/">/);
  assert.match(published,/<link rel="canonical" href="https:\/\/market\.example\/">/);
  assert.match(published,/<meta property="og:image" content="https:\/\/market\.example\/assets\/brand\/banggeut-share-v1.png">/);
  assert.match(published,/<meta name="twitter:image" content="https:\/\/market\.example\/assets\/brand\/banggeut-share-v1.png">/);
  assert.equal(configureShareMetadata(published,'https://market.example'),published);
  for(const invalid of ['http://market.example','https://user:password@market.example','https://market.example/subpath','https://market.example/?q=1','https://market.example/#/']) {
    assert.throws(()=>configureShareMetadata(html,invalid));
  }
  const video='/assets/video/banggeut-story.mp4';
  const head=await fetch(base+video,{method:'HEAD'});assert.equal(head.status,200);assert.equal(head.headers.get('content-type'),'video/mp4');assert.ok(Number(head.headers.get('content-length'))>0);
  const range=await fetch(base+video,{headers:{Range:'bytes=0-99'}});assert.equal(range.status,206);assert.equal((await range.arrayBuffer()).byteLength,100);
  const bad=await fetch(base+video,{headers:{Range:'bytes=999999999-'}});assert.equal(bad.status,416);
  assert.equal((await fetch(base+'/%2e%2e%2fREADME.md')).status,403);
  assert.equal((await fetch(base+'/missing.js')).status,404);
  assert.equal((await fetch(base,{method:'POST'})).status,405);
  console.log('Local server: page, sharing metadata/image, public origin configuration, video, ranges, file isolation passed');
} finally {server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
