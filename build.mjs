import { mkdirSync, copyFileSync } from 'node:fs';
mkdirSync('dist', {recursive:true});
for (const file of ['index.html','monitors.html','monitors.css','monitor-core.js','monitors.js','monitor-qr.svg','keycards.css','keycards.js']) copyFileSync(file, `dist/${file}`);
mkdirSync('dist/assets', {recursive:true});
for (const file of ['keycard-standard.png','keycard-metal-case.png']) copyFileSync(`assets/${file}`, `dist/assets/${file}`);
console.log('Static site prepared in dist/');
