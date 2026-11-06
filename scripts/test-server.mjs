import assert from 'node:assert/strict';
import {createServer} from './dev-server.mjs';
const server=createServer();
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
try {
  const page=await fetch(base);assert.equal(page.status,200);assert.match(await page.text(),/방긋/);
  const video='/assets/video/banggeut-story.mp4';
  const head=await fetch(base+video,{method:'HEAD'});assert.equal(head.status,200);assert.equal(head.headers.get('content-type'),'video/mp4');assert.ok(Number(head.headers.get('content-length'))>0);
  const range=await fetch(base+video,{headers:{Range:'bytes=0-99'}});assert.equal(range.status,206);assert.equal((await range.arrayBuffer()).byteLength,100);
  const bad=await fetch(base+video,{headers:{Range:'bytes=999999999-'}});assert.equal(bad.status,416);
  assert.equal((await fetch(base+'/%2e%2e%2fREADME.md')).status,403);
  assert.equal((await fetch(base+'/missing.js')).status,404);
  assert.equal((await fetch(base,{method:'POST'})).status,405);
  console.log('Local server: page, video, ranges, file isolation passed');
} finally {server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
