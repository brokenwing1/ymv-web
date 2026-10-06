import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const port = Number(process.env.PORT || 5173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    // Serve only the public site, never tooling, hidden files or source configuration.
    if (!/^(index\.html|(?:assets|styles|scripts)\/[^\\]+)$/.test(file) || file.split('/').some(part => part.startsWith('.'))) throw new Error('Not found');
    const location = path.resolve(root, file);
    if (!location.startsWith(root + path.sep) || !(await stat(location)).isFile()) throw new Error('Not found');
    const data = await readFile(location);
    response.writeHead(200, { 'Content-Type': types[path.extname(location)] || 'application/octet-stream', 'Content-Length': data.length, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch { response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); response.end('Не найдено'); }
});
server.listen(port, '127.0.0.1', () => console.log(`YMV Painting Lab: http://localhost:${port}`));
