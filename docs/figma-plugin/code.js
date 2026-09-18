/* Local Figma development plugin. No network, account, or payment operations. */
figma.showUI(__html__, { width: 420, height: 460, themeColors: true });

const expectedFileKey = 'LqRPvQwLT21JOqbGjazCyh';
const targetIds = {
  desktop: '3:25', mobile: '3:26',
  desktopScene: '5:143', mobileScene: '5:157',
  desktopButton: '5:134', mobileButton: '5:152',
  desktopLabel: 'I5:134;4185:3781', mobileLabel: 'I5:152;4185:3781',
};

async function requireTargetFile() {
  if (figma.fileKey && figma.fileKey !== expectedFileKey) {
    throw new Error('Open the existing Amber Atelier design file before running this plugin.');
  }
  const page = figma.root.children.find(p => p.id === '0:1' && p.name === '01 · The Amber Atelier');
  if (!page) throw new Error('Expected Amber Atelier page was not found; no changes made.');
  await figma.setCurrentPageAsync(page);
  const entries = await Promise.all(Object.entries(targetIds).map(async ([name, id]) => [name, await figma.getNodeByIdAsync(id)]));
  const nodes = Object.fromEntries(entries);
  for (const [name, node] of Object.entries(nodes)) {
    if (!node) throw new Error(`Missing ${name}. The design structure changed; no changes made.`);
  }
  if (nodes.desktop.name !== 'Desktop · 1440' || nodes.mobile.name !== 'Mobile · 390') {
    throw new Error('The artboard names do not match the recorded draft.');
  }
  return nodes;
}

async function loadCurrentFonts(text) {
  for (const segment of text.getStyledTextSegments(['fontName'])) {
    await figma.loadFontAsync(segment.fontName);
  }
}

async function repairLabels(nodes) {
  await Promise.all([loadCurrentFonts(nodes.desktopLabel), loadCurrentFonts(nodes.mobileLabel)]);
  for (const [button, label] of [[nodes.desktopButton, nodes.desktopLabel], [nodes.mobileButton, nodes.mobileLabel]]) {
    label.textAutoResize = 'WIDTH_AND_HEIGHT';
    label.layoutSizingHorizontal = 'HUG';
    label.layoutSizingVertical = 'HUG';
    label.lineHeight = { unit: 'PIXELS', value: 22 };
    button.primaryAxisSizingMode = 'AUTO';
    button.counterAxisSizingMode = 'AUTO';
    button.layoutSizingHorizontal = 'HUG';
    button.layoutSizingVertical = 'HUG';
  }
}

function fillScene(node, bytes) {
  const image = figma.createImage(new Uint8Array(bytes));
  node.fills = [{ type: 'IMAGE', imageHash: image.hash, scaleMode: 'FIT' }];
  // The MCP host exposes this overlay extension; regular Figma may not.
  if ('placeholder' in node) node.placeholder = false;
  return image.hash;
}

figma.ui.onmessage = async (message) => {
  if (message.type !== 'repair' && message.type !== 'finish') return;
  try {
    const nodes = await requireTargetFile();
    if (message.type === 'finish' && (!message.desktop || !message.mobile)) {
      throw new Error('Choose both actual scene PNG captures before applying images.');
    }
    await repairLabels(nodes);
    const imageHashes = {};
    if (message.type === 'finish') {
      imageHashes.desktop = fillScene(nodes.desktopScene, message.desktop);
      imageHashes.mobile = fillScene(nodes.mobileScene, message.mobile);
    }
    figma.viewport.scrollAndZoomIntoView([nodes.desktop, nodes.mobile]);
    figma.ui.postMessage({ type: 'success', text: message.type === 'finish'
      ? 'Thai CTA sizing corrected; actual scene captures inserted into the existing editable artboards. Review both artboards before calling this complete.'
      : 'Thai CTA sizing corrected. Scene slots still need the actual local scene PNG captures.', imageHashes });
  } catch (error) {
    figma.ui.postMessage({ type: 'error', text: error instanceof Error ? error.message : String(error) });
  }
};
