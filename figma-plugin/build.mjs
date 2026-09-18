import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const desktopScene = process.argv[2];
const mobileScene = process.argv[3] || desktopScene;
const encode = (path) => path && existsSync(path) ? readFileSync(path).toString('base64') : null;
const assets = {
  artwork: encode(resolve(root, 'docs/higgsfield-original.png')),
  desktop: encode(desktopScene),
  mobile: encode(mobileScene),
};
if (!assets.artwork) throw new Error('The real Higgsfield original PNG is required.');
const source = readFileSync(resolve(here, 'source.js'), 'utf8');
writeFileSync(resolve(here, 'code.js'), `const EMBEDDED = ${JSON.stringify(assets)};\n${source}`);
console.log(`Generated local Figma plugin. Actual scene images: desktop=${Boolean(assets.desktop)}, mobile=${Boolean(assets.mobile)}.`);
