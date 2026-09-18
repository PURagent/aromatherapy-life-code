// Read-only native Figma verification, except selection and viewport.
const page = figma.root.children.find(p => p.name === '02 · Native web design');
if (!page) throw new Error('Native design page was not found.');
await figma.setCurrentPageAsync(page);
const roots = page.children.filter(n => n.name === 'Native Desktop · 1440' || n.name === 'Native Mobile · 390');
const report = { page: { id: page.id, name: page.name }, frames: [] };
for (const root of roots) {
  const nodes = root.findAll(() => true);
  const texts = nodes.filter(n => n.type === 'TEXT');
  const images = nodes.filter(n => Array.isArray(n.fills) && n.fills.some(f => f.type === 'IMAGE'));
  const rows = nodes.filter(n => 'layoutMode' in n && n.layoutMode === 'HORIZONTAL' && n.children.length > 0);
  const overflow = texts.filter(n => {
    const p = n.parent;
    if (!p || !('width' in p)) return false;
    return n.x < -1 || n.x + n.width > p.width + 1 || n.y < -1 || n.y + n.height > p.height + 1;
  });
  report.frames.push({
    id: root.id, name: root.name, width: root.width, height: root.height,
    sections: root.children.map(n => ({ id:n.id, name:n.name, x:n.x, y:n.y, width:n.width, height:n.height })),
    counts: { nodes:nodes.length, text:texts.length, instances:nodes.filter(n=>n.type==='INSTANCE').length, vectors:nodes.filter(n=>n.type==='VECTOR').length, images:images.length, autoLayout:nodes.filter(n=>'layoutMode' in n && n.layoutMode!=='NONE').length },
    fontFamilies: [...new Set(texts.map(n => typeof n.fontName === 'symbol' ? 'mixed' : n.fontName.family))],
    shortHorizontalRows: rows.filter(n=>n.height < 10).map(n=>({id:n.id,name:n.name,width:n.width,height:n.height})),
    textOverflow: overflow.map(n=>({id:n.id,name:n.name,text:n.characters,x:n.x,y:n.y,width:n.width,height:n.height,parent:n.parent.name,parentWidth:n.parent.width,parentHeight:n.parent.height})),
    images: images.map(n=>({id:n.id,name:n.name,width:n.width,height:n.height,fills:n.fills.filter(f=>f.type==='IMAGE').map(f=>({hash:f.imageHash,scaleMode:f.scaleMode}))})),
  });
}
print(JSON.stringify(report, null, 2));
const desktop = roots.find(n => n.name === 'Native Desktop · 1440');
const hero = desktop && desktop.children.find(n => n.name === 'Hero');
if (hero) { figma.currentPage.selection = [hero]; figma.viewport.scrollAndZoomIntoView([hero]); }
