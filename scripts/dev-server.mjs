import http from 'node:http';
import {createReadStream} from 'node:fs';
import {stat, realpath} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.mp4':'video/mp4','.wav':'audio/wav','.mp3':'audio/mpeg','.woff2':'font/woff2'};
export function createServer() {
  return http.createServer(async (req,res) => {
    const fail = (code, message) => {res.writeHead(code, {'Content-Type':'text/plain; charset=utf-8'});res.end(message);};
    if (!['GET','HEAD'].includes(req.method)) {res.setHeader('Allow','GET, HEAD');return fail(405,'Method not allowed');}
    try {
      const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      if (pathname.includes('\0') || pathname.includes('\\') || pathname.split('/').some(s=>s.startsWith('.'))) return fail(403,'Forbidden');
      const target = await realpath(path.join(root, pathname === '/' ? 'index.html' : pathname));
      const relative = path.relative(await realpath(root),target);
      if (relative.startsWith('..') || path.isAbsolute(relative)) return fail(403,'Forbidden');
      const info = await stat(target);
      if (!info.isFile()) return fail(404,'Not found');
      let start=0,end=info.size-1,status=200;
      const headers={'Content-Type':types[path.extname(target).toLowerCase()]||'application/octet-stream','Cache-Control':'no-cache','Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff'};
      if (req.headers.range && req.method === 'GET') {
        const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        if (!match || (!match[1]&&!match[2])) {res.setHeader('Content-Range',`bytes */${info.size}`);return fail(416,'Invalid range');}
        if (match[1]) {start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),end):end;}
        else {start=Math.max(0,info.size-Number(match[2]));}
        if (!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=info.size) {res.setHeader('Content-Range',`bytes */${info.size}`);return fail(416,'Invalid range');}
        status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
      }
      headers['Content-Length']=Math.max(0,end-start+1);
      res.writeHead(status,headers);
      if (req.method==='HEAD'||info.size===0) return res.end();
      const stream=createReadStream(target,{start,end});
      stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
    } catch(error) {fail(error instanceof URIError ? 400 : error.code==='ENOENT' ? 404 : 500,'Unable to serve request');}
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port=Number(process.env.PORT || 3061);
  if (!Number.isInteger(port)||port<1||port>65535) throw new Error('Invalid PORT');
  const server=createServer();
  server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is already in use. Close the existing server and retry.`:error.message);process.exitCode=1;});
  server.listen(port,'127.0.0.1',()=>console.log(`방긋마켓: http://localhost:${port}\n종료: Ctrl+C`));
}
