import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
const root = fileURLToPath(new URL('..', import.meta.url));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate HTML ids');
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const value = match[1];
  if (value.startsWith('#')) { if (value.length > 1 && !ids.includes(value.slice(1))) throw new Error(`Missing anchor: ${value}`); }
  else if (!/^[a-z]+:/i.test(value)) await access(path.join(root, value));
}
for (const file of ['scripts/config.js', 'scripts/main.js']) new vm.Script(await readFile(path.join(root, file), 'utf8'), { filename: file });
console.log('Проверены локальные ресурсы, якоря, уникальность id и синтаксис JavaScript.');
