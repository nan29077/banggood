import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'../dist/assets');
const backgrounds=[...Array.from({length:9},(_,i)=>`background-${String(i+1).padStart(2,'0')}.jpg`),'real-community.jpg'];
const banners=['bazaar.jpg','hero.jpg','objects.jpg','people.jpg','community.jpg',...Array.from({length:4},(_,i)=>`banner-${String(i+6).padStart(2,'0')}.jpg`),'real-volunteers.jpg'];
const hashes=[];
for(const filename of [...backgrounds,...banners]){
 const data=fs.readFileSync(path.join(root,filename));
 assert(data.length>10000,`Missing or empty image: ${filename}`);
 assert.equal(data.readUInt16BE(0),0xffd8,`Invalid JPEG: ${filename}`);
 hashes.push(crypto.createHash('sha256').update(data).digest('hex'));
}
assert.equal(new Set(hashes).size,20,'Expected 20 distinct design images');
const avatars=fs.readdirSync(path.join(root,'avatars')).filter(f=>/^avatar-\d{2}\.svg$/.test(f));
assert.equal(avatars.length,30,'Expected 30 character profiles');
for(const filename of avatars){const svg=fs.readFileSync(path.join(root,'avatars',filename),'utf8');assert(svg.includes('<title>')&&svg.includes('viewBox="0 0 208 208"'),`Invalid avatar: ${filename}`)}
console.log('PASS: 10 whitespace images, 10 banner images, 30 SVG character profiles.');
