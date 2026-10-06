import { mkdir, cp, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('..', import.meta.url));
const out = path.join(root, 'dist');
await mkdir(out, { recursive: true });
await copyFile(path.join(root, 'index.html'), path.join(out, 'index.html'));
for (const folder of ['styles', 'scripts', 'assets']) {
  await cp(path.join(root, folder), path.join(out, folder), { recursive: true, filter: source => !source.endsWith('-source.jpg') && !source.endsWith('font-source.css') });
}
console.log('Готово: dist/ — статический сайт, готовый к размещению.');
