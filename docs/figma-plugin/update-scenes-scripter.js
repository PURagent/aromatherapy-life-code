// Standard native Figma editor script. Root supplies the two actual local PNG captures.
// No MCP calls, network requests, account changes, or arbitrary-node mutations.
const SCENES = { desktop: null, mobile: null };
const expectedFileKey = 'LqRPvQwLT21JOqbGjazCyh';
if (figma.fileKey && figma.fileKey !== expectedFileKey) {
  throw new Error('Open the recorded Life Code — The Amber Atelier file. No changes made.');
}
const page = figma.root.children.find(p => p.id === '18:8' && p.name === '02 · Native web design');
if (!page) throw new Error('Expected native design page18:8 was not found. No changes made.');
await figma.setCurrentPageAsync(page);
const ids = { desktop: '18:55', mobile: '18:216', desktopHero: '18:38' };
const entries = await Promise.all(Object.entries(ids).map(async ([name, id]) => [name, await figma.getNodeByIdAsync(id)]));
const nodes = Object.fromEntries(entries);
function hasAncestor(node, id) {
  let current = node;
  while (current) { if (current.id === id) return true; current = current.parent; }
  return false;
}
for (const key of ['desktop', 'mobile']) {
  if (!nodes[key] || nodes[key].type !== 'FRAME' || !hasAncestor(nodes[key], page.id)) {
    throw new Error(`Expected ${key} scene frame is missing or moved. No changes made.`);
  }
  if (typeof SCENES[key] !== 'string' || SCENES[key].length < 16) {
    throw new Error(`Supply the actual ${key} PNG bytes as base64. No changes made.`);
  }
}
if (!nodes.desktopHero || nodes.desktopHero.name !== 'Hero' || !hasAncestor(nodes.desktop, nodes.desktopHero.id)) {
  throw new Error('Desktop hero structure changed. No changes made.');
}
if (!hasAncestor(nodes.desktop, '18:16') || !hasAncestor(nodes.mobile, '18:177')) {
  throw new Error('Scene frames are not inside the expected artboards. No changes made.');
}
function decode64(source) {
  const clean = source.replace(/^data:image\/png;base64,/, '').replace(/\s/g, '');
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(clean)) throw new Error('Invalid PNG base64. No changes made.');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const output = [];
  let bits = 0, value = 0;
  for (let i = 0; i < clean.length; i++) {
    const n = alphabet.indexOf(clean[i]);
    if (n < 0) continue;
    value = (value << 6) | n;
    bits += 6;
    if (bits >= 8) { bits -= 8; output.push((value >> bits) & 255); }
  }
  const bytes = new Uint8Array(output);
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  if (bytes.length < 24 || signature.some((byte, i) => bytes[i] !== byte)) {
    throw new Error('The supplied image is not a PNG. No changes made.');
  }
  return bytes;
}
// Decode and import both assets before mutating either visible frame.
const bytes = { desktop: decode64(SCENES.desktop), mobile: decode64(SCENES.mobile) };
const images = { desktop: figma.createImage(bytes.desktop), mobile: figma.createImage(bytes.mobile) };
const dimensions = Object.fromEntries(await Promise.all(
  Object.entries(images).map(async ([key, image]) => [key, await image.getSizeAsync()]),
));
const result = [];
for (const key of ['desktop', 'mobile']) {
  const node = nodes[key];
  const imageSize = dimensions[key];
  const aspectDifference = Math.abs((imageSize.width / imageSize.height) / (node.width / node.height) - 1);
  // Fill near-identical aspect ratios; otherwise retain the entire real scene with Fit.
  const scaleMode = aspectDifference <= 0.015 ? 'FILL' : 'FIT';
  node.fills = [{ type: 'IMAGE', imageHash: images[key].hash, scaleMode }];
  node.name = `Live Three.js scene — ${key} still`;
  result.push({
    key, id: node.id, name: node.name, imageHash: images[key].hash,
    frame: { width: node.width, height: node.height }, image: imageSize, scaleMode,
  });
}
print(JSON.stringify({ pageId: page.id, updated: result }, null, 2));
figma.currentPage.selection = [nodes.desktopHero];
figma.viewport.scrollAndZoomIntoView([nodes.desktopHero]);
