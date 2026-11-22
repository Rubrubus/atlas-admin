import { mkdirSync, copyFileSync } from 'node:fs';
mkdirSync('dist', {recursive:true});
for (const file of ['index.html','style.css','script.js','monitors.html','monitors.css','monitor-core.js','monitors.js','monitor-qr.svg','keycards.css','keycards.js']) copyFileSync(file, `dist/${file}`);
console.log('Static site prepared in dist/');
